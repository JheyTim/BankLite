import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Append-only transfer status history.
 */
@Entity({ name: 'transfer_status_history', schema: 'transfer_schema' })
export class TransferStatusHistory {
  /**
   * Unique status history ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Transfer affected by this status change.
   */
  @Index()
  @Column({ type: 'uuid' })
  transferId!: string;

  /**
   * Previous status.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  previousStatus?:
    | 'PENDING'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED'
    | 'REVERSED';

  /**
   * New status.
   */
  @Column({ type: 'varchar', length: 50 })
  newStatus!: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

  /**
   * Human-readable reason for the status change.
   */
  @Column({ type: 'varchar', length: 255 })
  reason!: string;

  /**
   * When this history record was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
