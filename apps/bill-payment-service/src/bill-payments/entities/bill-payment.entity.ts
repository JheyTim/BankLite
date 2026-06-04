import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Bill payment request owned by Bill Payment Service.
 * Balance movement is handled by Ledger Service.
 */
@Entity({ name: 'bill_payments', schema: 'bill_payment_schema' })
export class BillPayment {
  /**
   * Unique bill payment ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * User who requested the payment.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * Account that will be debited.
   */
  @Index()
  @Column({ type: 'uuid' })
  fromAccountId!: string;

  /**
   * Biller receiving the payment.
   */
  @Index()
  @Column({ type: 'uuid' })
  billerId!: string;

  /**
   * Customer reference/account number at the biller.
   */
  @Column({ type: 'varchar', length: 255 })
  billerReferenceNumber!: string;

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
   * Current bill payment status.
   */
  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED';

  /**
   * Client-provided idempotency key.
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
   * Failure reason.
   */
  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  /**
   * When payment was completed.
   */
  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  /**
   * When payment failed.
   */
  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  /**
   * When bill payment was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When bill payment was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
