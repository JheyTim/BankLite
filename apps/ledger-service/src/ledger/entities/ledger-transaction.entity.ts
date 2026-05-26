import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Top-level ledger transaction.
 * This groups debit and credit entries under one business transaction.
 */
@Entity({ name: 'ledger_transactions', schema: 'ledger_schema' })
export class LedgerTransaction {
  /**
   * Unique ledger transaction ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Business source of this ledger transaction.
   */
  @Column({ type: 'varchar', length: 50 })
  referenceType!: 'DEPOSIT' | 'TRANSFER' | 'BILL_PAYMENT';

  /**
   * Business ID from the originating service.
   */
  @Index()
  @Column({ type: 'varchar', length: 100 })
  referenceId!: string;

  /**
   * Current ledger transaction status.
   */
  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: 'PENDING' | 'POSTED' | 'REVERSED' | 'FAILED';

  /**
   * Currency for all entries in this transaction.
   */
  @Column({ type: 'varchar', length: 10 })
  currency!: 'PHP' | 'USD';

  /**
   * When the transaction was posted.
   */
  @Column({ type: 'timestamp', nullable: true })
  postedAt?: Date;

  /**
   * Failure reason if posting failed.
   */
  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  /**
   * When the ledger transaction was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
