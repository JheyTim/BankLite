import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AccountActivatedEvent, TransferRequestedEvent } from '@app/contracts';
import { AccountBalance } from './entities/account-balance.entity';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { LedgerTransaction } from './entities/ledger-transaction.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateTransferPostingDto } from './dto/create-transfer-posting.dto';
import { LedgerPublisher } from './ledger.publisher';

/**
 * Contains ledger business logic.
 * This is the source of truth for money movement.
 */
@Injectable()
export class LedgerService {
  constructor(
    /**
     * Used to execute database transactions.
     */
    private readonly dataSource: DataSource,

    /**
     * Repository for account balances.
     */
    @InjectRepository(AccountBalance)
    private readonly accountBalanceRepository: Repository<AccountBalance>,

    /**
     * Repository for ledger transactions.
     */
    @InjectRepository(LedgerTransaction)
    private readonly ledgerTransactionRepository: Repository<LedgerTransaction>,

    /**
     * Repository for ledger entries.
     */
    @InjectRepository(LedgerEntry)
    private readonly ledgerEntryRepository: Repository<LedgerEntry>,

    /**
     * Publishes ledger events.
     */
    private readonly ledgerPublisher: LedgerPublisher,
  ) {}

  /**
   * Creates a zero balance row when Account Service activates an account.
   */
  async initializeBalanceFromAccountActivated(event: AccountActivatedEvent) {
    /**
     * Idempotency check: balance row should only be created once per account.
     */
    const existingBalance = await this.accountBalanceRepository.findOne({
      where: {
        accountId: event.accountId,
      },
    });

    if (existingBalance) {
      return existingBalance;
    }

    /**
     * New accounts always start with zero balance.
     */
    const balance = this.accountBalanceRepository.create({
      accountId: event.accountId,
      userId: event.userId,
      availableBalanceMinor: 0,
      currentBalanceMinor: 0,
      currency: event.currency,
    });

    return this.accountBalanceRepository.save(balance);
  }

  /**
   * Reads account balance.
   */
  async getBalance(accountId: string) {
    const balance = await this.accountBalanceRepository.findOne({
      where: { accountId },
    });

    if (!balance) {
      throw new NotFoundException('Account balance not found.');
    }

    return balance;
  }

  /**
   * Lists ledger entries for one account.
   */
  async listEntriesByAccount(accountId: string) {
    return this.ledgerEntryRepository.find({
      where: { accountId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Local testing helper: deposit money into an account.
   * This uses a system cash account as the debit side.
   */
  async createDeposit(dto: CreateDepositDto) {
    /**
     * For learning, this is a fake system account ID.
     * It lets us keep a double-entry shape for deposits.
     */
    const systemCashAccountId = '00000000-0000-0000-0000-000000000001';

    return this.postDoubleEntryTransaction({
      referenceType: 'DEPOSIT',
      referenceId: uuidv4(),
      debitAccountId: systemCashAccountId,
      creditAccountId: dto.accountId,
      amountMinor: dto.amountMinor,
      currency: dto.currency,
      correlationId: uuidv4(),
      shouldCheckDebitFunds: false,
    });
  }

  /**
   * Local testing helper: transfer money between two existing accounts.
   */
  async createTransferPosting(dto: CreateTransferPostingDto) {
    return this.postDoubleEntryTransaction({
      referenceType: 'TRANSFER',
      referenceId: uuidv4(),
      debitAccountId: dto.fromAccountId,
      creditAccountId: dto.toAccountId,
      amountMinor: dto.amountMinor,
      currency: dto.currency,
      correlationId: uuidv4(),
      shouldCheckDebitFunds: true,
    });
  }

  /**
   * Handles transfer.requested events from Transfer Service.
   */
  async postTransferFromEvent(event: TransferRequestedEvent) {
    return this.postDoubleEntryTransaction({
      referenceType: 'TRANSFER',
      referenceId: event.transferId,
      debitAccountId: event.fromAccountId,
      creditAccountId: event.toAccountId,
      amountMinor: event.amountMinor,
      currency: event.currency,
      correlationId: event.correlationId,
      shouldCheckDebitFunds: true,
    });
  }

  /**
   * Core double-entry posting function.
   * This writes ledger transaction, ledger entries, and balance updates
   * inside one PostgreSQL transaction.
   */
  private async postDoubleEntryTransaction(params: {
    referenceType: 'DEPOSIT' | 'TRANSFER' | 'BILL_PAYMENT';
    referenceId: string;
    debitAccountId: string;
    creditAccountId: string;
    amountMinor: number;
    currency: 'PHP' | 'USD';
    correlationId: string;
    shouldCheckDebitFunds: boolean;
  }) {
    if (params.amountMinor <= 0) {
      throw new BadRequestException('Amount must be greater than zero.');
    }

    if (params.debitAccountId === params.creditAccountId) {
      throw new BadRequestException('Debit and credit accounts must differ.');
    }

    try {
      const result = await this.dataSource.transaction(async (manager) => {
        /**
         * Idempotency check by reference type and reference ID.
         */
        const existingTransaction = await manager.findOne(LedgerTransaction, {
          where: {
            referenceType: params.referenceType,
            referenceId: params.referenceId,
          },
        });

        if (existingTransaction?.status === 'POSTED') {
          return existingTransaction;
        }

        /**
         * Load credit account balance.
         */
        const creditBalance = await manager.findOne(AccountBalance, {
          where: {
            accountId: params.creditAccountId,
          },
        });

        if (!creditBalance) {
          throw new NotFoundException('Credit account balance not found.');
        }

        if (creditBalance.currency !== params.currency) {
          throw new BadRequestException('Credit account currency mismatch.');
        }

        /**
         * Load debit account balance unless this is a system deposit.
         */
        let debitBalance: AccountBalance | null = null;

        if (params.shouldCheckDebitFunds) {
          debitBalance = await manager.findOne(AccountBalance, {
            where: {
              accountId: params.debitAccountId,
            },
          });

          if (!debitBalance) {
            throw new NotFoundException('Debit account balance not found.');
          }

          if (debitBalance.currency !== params.currency) {
            throw new BadRequestException('Debit account currency mismatch.');
          }

          if (Number(debitBalance.availableBalanceMinor) < params.amountMinor) {
            throw new BadRequestException('Insufficient funds.');
          }
        }

        /**
         * Create the parent ledger transaction.
         */
        const ledgerTransaction = manager.create(LedgerTransaction, {
          referenceType: params.referenceType,
          referenceId: params.referenceId,
          status: 'POSTED',
          currency: params.currency,
          postedAt: new Date(),
        });

        const savedLedgerTransaction = await manager.save(ledgerTransaction);

        /**
         * Create debit entry.
         */
        const debitEntry = manager.create(LedgerEntry, {
          ledgerTransactionId: savedLedgerTransaction.id,
          accountId: params.debitAccountId,
          direction: 'DEBIT',
          amountMinor: params.amountMinor,
          currency: params.currency,
        });

        /**
         * Create credit entry.
         */
        const creditEntry = manager.create(LedgerEntry, {
          ledgerTransactionId: savedLedgerTransaction.id,
          accountId: params.creditAccountId,
          direction: 'CREDIT',
          amountMinor: params.amountMinor,
          currency: params.currency,
        });

        await manager.save([debitEntry, creditEntry]);

        /**
         * Decrease debit account balance for real transfers.
         */
        if (debitBalance) {
          debitBalance.availableBalanceMinor =
            Number(debitBalance.availableBalanceMinor) - params.amountMinor;
          debitBalance.currentBalanceMinor =
            Number(debitBalance.currentBalanceMinor) - params.amountMinor;

          await manager.save(debitBalance);
        }

        /**
         * Increase credit account balance.
         */
        creditBalance.availableBalanceMinor =
          Number(creditBalance.availableBalanceMinor) + params.amountMinor;
        creditBalance.currentBalanceMinor =
          Number(creditBalance.currentBalanceMinor) + params.amountMinor;

        await manager.save(creditBalance);

        return savedLedgerTransaction;
      });

      /**
       * Publish success event.
       */
      await this.ledgerPublisher.publishLedgerPosted({
        ledgerTransactionId: result.id,
        referenceType: params.referenceType,
        referenceId: params.referenceId,
        debitAccountId: params.debitAccountId,
        creditAccountId: params.creditAccountId,
        amountMinor: params.amountMinor,
        currency: params.currency,
        eventId: uuidv4(),
        correlationId: params.correlationId,
        postedAt: result.postedAt!.toISOString(),
      });

      return result;
    } catch (error) {
      /**
       * Publish failure event for downstream services.
       */
      await this.ledgerPublisher.publishLedgerFailed({
        referenceType: params.referenceType,
        referenceId: params.referenceId,
        reason:
          error instanceof Error ? error.message : 'Unknown ledger error.',
        debitAccountId: params.debitAccountId,
        creditAccountId: params.creditAccountId,
        amountMinor: params.amountMinor,
        currency: params.currency,
        eventId: uuidv4(),
        correlationId: params.correlationId,
        failedAt: new Date().toISOString(),
      });

      throw error;
    }
  }
}
