import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LedgerFailedEvent, LedgerPostedEvent } from '@app/contracts';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { TransferStatusHistory } from './entities/transfer-status-history.entity';
import { TransferPublisher } from './transfer.publisher';

/**
 * Contains transfer business logic.
 */
@Injectable()
export class TransferService {
  constructor(
    /**
     * Repository for transfer records.
     */
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,

    /**
     * Repository for append-only transfer status history.
     */
    @InjectRepository(TransferStatusHistory)
    private readonly statusHistoryRepository: Repository<TransferStatusHistory>,

    /**
     * Publishes transfer events.
     */
    private readonly transferPublisher: TransferPublisher,
  ) {}

  /**
   * Creates a transfer and publishes transfer.requested.
   */
  async createTransfer(dto: CreateTransferDto) {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException(
        'Source and destination accounts must differ.',
      );
    }

    /**
     * Idempotency check.
     * If the same idempotency key was already used, return the existing transfer.
     */
    const existingTransfer = await this.transferRepository.findOne({
      where: {
        idempotencyKey: dto.idempotencyKey,
      },
    });

    if (existingTransfer) {
      return existingTransfer;
    }

    /**
     * Create transfer as PROCESSING immediately because it will be handed to Ledger.
     */
    const transfer = this.transferRepository.create({
      userId: dto.userId,
      fromAccountId: dto.fromAccountId,
      toAccountId: dto.toAccountId,
      amountMinor: dto.amountMinor,
      currency: dto.currency,
      status: 'PROCESSING',
      idempotencyKey: dto.idempotencyKey,
    });

    const savedTransfer = await this.transferRepository.save(transfer);

    /**
     * Store status history.
     */
    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        transferId: savedTransfer.id,
        previousStatus: 'PENDING',
        newStatus: 'PROCESSING',
        reason: 'Transfer request sent to Ledger Service.',
      }),
    );

    /**
     * Shared workflow ID for tracing.
     */
    const correlationId = uuidv4();

    /**
     * Publish transfer.requested to Ledger Service.
     */
    await this.transferPublisher.publishTransferRequested({
      transferId: savedTransfer.id,
      userId: savedTransfer.userId,
      fromAccountId: savedTransfer.fromAccountId,
      toAccountId: savedTransfer.toAccountId,
      amountMinor: Number(savedTransfer.amountMinor),
      currency: savedTransfer.currency,
      idempotencyKey: savedTransfer.idempotencyKey,
      eventId: uuidv4(),
      correlationId,
      createdAt: savedTransfer.createdAt.toISOString(),
    });

    return savedTransfer;
  }

  /**
   * Marks transfer as completed after ledger.posted.
   */
  async handleLedgerPosted(event: LedgerPostedEvent) {
    /**
     * Only process transfer-related ledger postings.
     */
    if (event.referenceType !== 'TRANSFER') {
      return;
    }

    const transfer = await this.transferRepository.findOne({
      where: {
        id: event.referenceId,
      },
    });

    if (!transfer) {
      throw new NotFoundException(
        'Transfer not found for ledger posted event.',
      );
    }

    /**
     * Idempotency check.
     */
    if (transfer.status === 'COMPLETED') {
      return transfer;
    }

    const previousStatus = transfer.status;

    transfer.status = 'COMPLETED';
    transfer.ledgerTransactionId = event.ledgerTransactionId;
    transfer.completedAt = new Date(event.postedAt);

    const savedTransfer = await this.transferRepository.save(transfer);

    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        transferId: savedTransfer.id,
        previousStatus,
        newStatus: 'COMPLETED',
        reason: 'Ledger transaction posted successfully.',
      }),
    );

    await this.transferPublisher.publishTransferCompleted({
      transferId: savedTransfer.id,
      ledgerTransactionId: event.ledgerTransactionId,
      fromAccountId: savedTransfer.fromAccountId,
      toAccountId: savedTransfer.toAccountId,
      amountMinor: Number(savedTransfer.amountMinor),
      currency: savedTransfer.currency,
      eventId: uuidv4(),
      correlationId: event.correlationId,
      completedAt: savedTransfer.completedAt!.toISOString(),
    });

    return savedTransfer;
  }

  /**
   * Marks transfer as failed after ledger.failed.
   */
  async handleLedgerFailed(event: LedgerFailedEvent) {
    /**
     * Only process transfer-related ledger failures.
     */
    if (event.referenceType !== 'TRANSFER') {
      return;
    }

    const transfer = await this.transferRepository.findOne({
      where: {
        id: event.referenceId,
      },
    });

    if (!transfer) {
      throw new NotFoundException(
        'Transfer not found for ledger failed event.',
      );
    }

    /**
     * Idempotency check.
     */
    if (transfer.status === 'FAILED') {
      return transfer;
    }

    const previousStatus = transfer.status;

    transfer.status = 'FAILED';
    transfer.failureReason = event.reason;
    transfer.failedAt = new Date(event.failedAt);

    const savedTransfer = await this.transferRepository.save(transfer);

    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        transferId: savedTransfer.id,
        previousStatus,
        newStatus: 'FAILED',
        reason: event.reason,
      }),
    );

    await this.transferPublisher.publishTransferFailed({
      transferId: savedTransfer.id,
      fromAccountId: savedTransfer.fromAccountId,
      toAccountId: savedTransfer.toAccountId,
      amountMinor: Number(savedTransfer.amountMinor),
      currency: savedTransfer.currency,
      reason: event.reason,
      eventId: uuidv4(),
      correlationId: event.correlationId,
      failedAt: savedTransfer.failedAt!.toISOString(),
    });

    return savedTransfer;
  }

  /**
   * Reads one transfer by ID.
   */
  async getTransferById(id: string) {
    const transfer = await this.transferRepository.findOne({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found.');
    }

    return transfer;
  }

  /**
   * Lists transfers for one user.
   */
  async listTransfersByUser(userId: string) {
    return this.transferRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Lists transfer status history.
   */
  async getTransferStatusHistory(transferId: string) {
    return this.statusHistoryRepository.find({
      where: { transferId },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
