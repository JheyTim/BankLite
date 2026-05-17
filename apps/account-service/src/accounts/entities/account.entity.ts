import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Bank account metadata owned by Account Service.
 * This service does not store balances. Balances belong to Ledger Service.
 */
@Entity({ name: 'accounts', schema: 'account_schema' })
export class Account {
  /**
   * Unique account ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * User who owns this account.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * Account type.
   */
  @Column({ type: 'varchar', length: 50, default: 'SAVINGS' })
  accountType!: 'SAVINGS' | 'CHECKING' | 'WALLET';

  /**
   * Account status.
   */
  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: 'PENDING' | 'ACTIVE' | 'FROZEN' | 'CLOSED';

  /**
   * Account currency.
   */
  @Column({ type: 'varchar', length: 10, default: 'PHP' })
  currency!: 'PHP' | 'USD';

  /**
   * KYC case that allowed this account to be created.
   */
  @Index()
  @Column({ type: 'uuid' })
  kycCaseId!: string;

  /**
   * Timestamp when account became active.
   */
  @Column({ type: 'timestamp', nullable: true })
  activatedAt?: Date;

  /**
   * When account was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When account was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
