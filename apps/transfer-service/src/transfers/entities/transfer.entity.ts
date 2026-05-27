import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Transfer request owned by Transfer Service.
 * The actual balance movement is owned by Ledger Service.
 */
@Entity({ name: 'transfers', schema: 'transfer_schema' })
export class Transfer {
  /**
   * Unique transfer ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * User who initiated the transfer.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * Account where money will be deducted.
   */
  @Index()
  @Column({ type: 'uuid' })
  fromAccountId!: string;

  /**
   * Account where money will be credited.
   */
  @Index()
  @Column({ type: 'uuid' })
  toAccountId!: string;

  /**
   * Amount in minor units.
   */
  @Column({ type: 'bigint' })
  amountMinor!: number;

  /**
   * Currency code.
   */
  @Column({ type: 'varchar', length: 10 })
  currency!: 'PHP' | 'USD';

  /**
   * Current transfer status.
   */
  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

  /**
   * User-provided idempotency key.
   * Prevents duplicate transfer creation when clients retry.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  idempotencyKey!: string;

  /**
   * Ledger transaction ID after successful posting.
   */
  @Column({ type: 'uuid', nullable: true })
  ledgerTransactionId?: string;

  /**
   * Failure reason when status is FAILED.
   */
  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  /**
   * When transfer completed.
   */
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  /**
   * When transfer failed.
   */
  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  /**
   * When transfer was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When transfer was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
