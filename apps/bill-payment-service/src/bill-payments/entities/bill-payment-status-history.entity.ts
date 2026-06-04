import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Append-only bill payment status history.
 */
@Entity({ name: 'bill_payment_status_history', schema: 'bill_payment_schema' })
export class BillPaymentStatusHistory {
  /**
   * Unique status history ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Bill payment affected by this status change.
   */
  @Index()
  @Column({ type: 'uuid' })
  billPaymentId!: string;

  /**
   * Previous status.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  previousStatus?: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED';

  /**
   * New status.
   */
  @Column({ type: 'varchar', length: 50 })
  newStatus!: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED';

  /**
   * Human-readable reason.
   */
  @Column({ type: 'varchar', length: 255 })
  reason!: string;

  /**
   * When this history record was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
