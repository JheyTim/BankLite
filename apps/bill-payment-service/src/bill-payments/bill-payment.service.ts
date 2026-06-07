import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LedgerFailedEvent, LedgerPostedEvent } from '@app/contracts';
import { CreateBillerDto } from './dto/create-biller.dto';
import { CreateBillPaymentDto } from './dto/create-bill-payment.dto';
import { Biller } from './entities/biller.entity';
import { BillPayment } from './entities/bill-payment.entity';
import { BillPaymentStatusHistory } from './entities/bill-payment-status-history.entity';
import { BillPaymentPublisher } from './bill-payment.publisher';

/**
 * Contains bill payment business logic.
 */
@Injectable()
export class BillPaymentService {
  constructor(
    /**
     * Repository for billers.
     */
    @InjectRepository(Biller)
    private readonly billerRepository: Repository<Biller>,

    /**
     * Repository for bill payments.
     */
    @InjectRepository(BillPayment)
    private readonly billPaymentRepository: Repository<BillPayment>,

    /**
     * Repository for status history.
     */
    @InjectRepository(BillPaymentStatusHistory)
    private readonly statusHistoryRepository: Repository<BillPaymentStatusHistory>,

    /**
     * Publishes bill payment events.
     */
    private readonly billPaymentPublisher: BillPaymentPublisher,
  ) {}

  /**
   * Creates a biller.
   */
  async createBiller(dto: CreateBillerDto) {
    const existingBiller = await this.billerRepository.findOne({
      where: { name: dto.name },
    });

    if (existingBiller) {
      return existingBiller;
    }

    const biller = this.billerRepository.create({
      name: dto.name,
      category: dto.category,
      isActive: true,
    });

    return this.billerRepository.save(biller);
  }

  /**
   * Lists all active billers.
   */
  async listBillers() {
    return this.billerRepository.find({
      where: {
        isActive: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  /**
   * Creates a bill payment and publishes bill.payment.requested.
   */
  async createBillPayment(dto: CreateBillPaymentDto) {
    /**
     * Idempotency check.
     */
    const existingPayment = await this.billPaymentRepository.findOne({
      where: {
        idempotencyKey: dto.idempotencyKey,
      },
    });

    if (existingPayment) {
      return existingPayment;
    }

    /**
     * Validate biller.
     */
    const biller = await this.billerRepository.findOne({
      where: {
        id: dto.billerId,
      },
    });

    if (!biller || !biller.isActive) {
      throw new BadRequestException('Biller is not available.');
    }

    /**
     * Create bill payment as PROCESSING.
     */
    const billPayment = this.billPaymentRepository.create({
      userId: dto.userId,
      fromAccountId: dto.fromAccountId,
      billerId: dto.billerId,
      billerReferenceNumber: dto.billerReferenceNumber,
      amountMinor: dto.amountMinor,
      currency: dto.currency,
      status: 'PROCESSING',
      idempotencyKey: dto.idempotencyKey,
    });

    const savedPayment = await this.billPaymentRepository.save(billPayment);

    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        billPaymentId: savedPayment.id,
        previousStatus: 'PENDING',
        newStatus: 'PROCESSING',
        reason: 'Bill payment request sent to Ledger Service.',
      }),
    );

    const correlationId = uuidv4();

    /**
     * Publish bill.payment.requested to Ledger Service.
     */
    await this.billPaymentPublisher.publishBillPaymentRequested({
      billPaymentId: savedPayment.id,
      userId: savedPayment.userId,
      fromAccountId: savedPayment.fromAccountId,
      billerId: savedPayment.billerId,
      billerReferenceNumber: savedPayment.billerReferenceNumber,
      amountMinor: Number(savedPayment.amountMinor),
      currency: savedPayment.currency,
      idempotencyKey: savedPayment.idempotencyKey,
      eventId: uuidv4(),
      correlationId,
      createdAt: savedPayment.createdAt.toISOString(),
    });

    return savedPayment;
  }

  /**
   * Marks a bill payment as PAID after ledger.posted.
   */
  async handleLedgerPosted(event: LedgerPostedEvent) {
    if (event.referenceType !== 'BILL_PAYMENT') {
      return;
    }

    const billPayment = await this.billPaymentRepository.findOne({
      where: {
        id: event.referenceId,
      },
    });

    if (!billPayment) {
      throw new NotFoundException(
        'Bill payment not found for ledger posted event.',
      );
    }

    if (billPayment.status === 'PAID') {
      return billPayment;
    }

    const previousStatus = billPayment.status;

    billPayment.status = 'PAID';
    billPayment.ledgerTransactionId = event.ledgerTransactionId;
    billPayment.paidAt = new Date(event.postedAt);

    const savedPayment = await this.billPaymentRepository.save(billPayment);

    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        billPaymentId: savedPayment.id,
        previousStatus,
        newStatus: 'PAID',
        reason: 'Ledger transaction posted successfully.',
      }),
    );

    await this.billPaymentPublisher.publishBillPaymentCompleted({
      billPaymentId: savedPayment.id,
      ledgerTransactionId: event.ledgerTransactionId,
      userId: savedPayment.userId,
      fromAccountId: savedPayment.fromAccountId,
      billerId: savedPayment.billerId,
      amountMinor: Number(savedPayment.amountMinor),
      currency: savedPayment.currency,
      eventId: uuidv4(),
      correlationId: event.correlationId,
      completedAt: savedPayment.paidAt!.toISOString(),
    });

    return savedPayment;
  }

  /**
   * Marks a bill payment as FAILED after ledger.failed.
   */
  async handleLedgerFailed(event: LedgerFailedEvent) {
    if (event.referenceType !== 'BILL_PAYMENT') {
      return;
    }

    const billPayment = await this.billPaymentRepository.findOne({
      where: {
        id: event.referenceId,
      },
    });

    if (!billPayment) {
      throw new NotFoundException(
        'Bill payment not found for ledger failed event.',
      );
    }

    if (billPayment.status === 'FAILED') {
      return billPayment;
    }

    const previousStatus = billPayment.status;

    billPayment.status = 'FAILED';
    billPayment.failureReason = event.reason;
    billPayment.failedAt = new Date(event.failedAt);

    const savedPayment = await this.billPaymentRepository.save(billPayment);

    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        billPaymentId: savedPayment.id,
        previousStatus,
        newStatus: 'FAILED',
        reason: event.reason,
      }),
    );

    await this.billPaymentPublisher.publishBillPaymentFailed({
      billPaymentId: savedPayment.id,
      userId: savedPayment.userId,
      fromAccountId: savedPayment.fromAccountId,
      billerId: savedPayment.billerId,
      amountMinor: Number(savedPayment.amountMinor),
      currency: savedPayment.currency,
      reason: event.reason,
      eventId: uuidv4(),
      correlationId: event.correlationId,
      failedAt: savedPayment.failedAt!.toISOString(),
    });

    return savedPayment;
  }

  /**
   * Reads one bill payment by ID.
   */
  async getBillPaymentById(id: string) {
    const billPayment = await this.billPaymentRepository.findOne({
      where: { id },
    });

    if (!billPayment) {
      throw new NotFoundException('Bill payment not found.');
    }

    return billPayment;
  }

  /**
   * Lists bill payments for one user.
   */
  async listBillPaymentsByUser(userId: string) {
    return this.billPaymentRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Lists bill payment status history.
   */
  async getBillPaymentStatusHistory(billPaymentId: string) {
    return this.statusHistoryRepository.find({
      where: { billPaymentId },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
