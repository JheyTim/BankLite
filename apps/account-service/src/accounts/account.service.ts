import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { KycVerifiedEvent } from '@app/contracts';
import { Account } from './entities/account.entity';
import { AccountStatusHistory } from './entities/account-status-history.entity';
import { AccountPublisher } from './account.publisher';

/**
 * Contains account business logic.
 */
@Injectable()
export class AccountService {
  constructor(
    /**
     * Repository for account records.
     */
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    /**
     * Repository for append-only account status history.
     */
    @InjectRepository(AccountStatusHistory)
    private readonly statusHistoryRepository: Repository<AccountStatusHistory>,

    /**
     * Publishes account lifecycle events.
     */
    private readonly accountPublisher: AccountPublisher,
  ) {}

  /**
   * Creates and activates a default savings account after KYC verification.
   * This method is idempotent. A verified user should not receive duplicate
   * default accounts from repeated kyc.verified events.
   */
  async createAccountFromKycVerified(event: KycVerifiedEvent) {
    /**
     * Check if this KYC case already created an account.
     */
    const existingAccountByKycCase = await this.accountRepository.findOne({
      where: { kycCaseId: event.kycCaseId },
    });

    if (existingAccountByKycCase) {
      return existingAccountByKycCase;
    }

    /**
     * Check if the user already has an active PHP savings account.
     * This prevents duplicate default accounts.
     */
    const existingDefaultAccount = await this.accountRepository.findOne({
      where: {
        userId: event.userId,
        accountType: 'SAVINGS',
        currency: 'PHP',
      },
    });

    if (existingDefaultAccount) {
      return existingDefaultAccount;
    }

    /**
     * Create the account as ACTIVE because KYC is already verified.
     */
    const account = this.accountRepository.create({
      userId: event.userId,
      accountType: 'SAVINGS',
      status: 'ACTIVE',
      currency: 'PHP',
      kycCaseId: event.kycCaseId,
      activatedAt: new Date(),
    });

    const savedAccount = await this.accountRepository.save(account);

    /**
     * Store append-only status history.
     */
    await this.statusHistoryRepository.save(
      this.statusHistoryRepository.create({
        accountId: savedAccount.id,
        previousStatus: undefined,
        newStatus: 'ACTIVE',
        reason: 'Account activated after KYC verification.',
        changedByUserId: event.reviewedByUserId,
      }),
    );

    /**
     * Publish account.created.
     */
    await this.accountPublisher.publishAccountCreated({
      accountId: savedAccount.id,
      userId: savedAccount.userId,
      accountType: savedAccount.accountType,
      status: savedAccount.status,
      currency: savedAccount.currency,
      eventId: uuidv4(),
      correlationId: event.correlationId,
      createdAt: savedAccount.createdAt.toISOString(),
    });

    /**
     * Publish account.activated.
     */
    await this.accountPublisher.publishAccountActivated({
      accountId: savedAccount.id,
      userId: savedAccount.userId,
      accountType: savedAccount.accountType,
      currency: savedAccount.currency,
      eventId: uuidv4(),
      correlationId: event.correlationId,
      activatedAt: savedAccount.activatedAt!.toISOString(),
    });

    return savedAccount;
  }

  /**
   * Lists accounts owned by one user.
   */
  async listAccountsByUser(userId: string) {
    return this.accountRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Reads one account by ID.
   */
  async getAccountById(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return account;
  }

  /**
   * Lists status history for one account.
   */
  async getAccountStatusHistory(accountId: string) {
    return this.statusHistoryRepository.find({
      where: { accountId },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
