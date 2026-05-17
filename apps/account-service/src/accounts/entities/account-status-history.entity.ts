import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Append-only account status history.
 * This helps us audit account lifecycle changes.
 */
@Entity({ name: 'account_status_history', schema: 'account_schema' })
export class AccountStatusHistory {
  /**
   * Unique status history ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Account affected by this status change.
   */
  @Index()
  @Column({ type: 'uuid' })
  accountId!: string;

  /**
   * Previous status before the change.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  previousStatus?: 'PENDING' | 'ACTIVE' | 'FROZEN' | 'CLOSED';

  /**
   * New status after the change.
   */
  @Column({ type: 'varchar', length: 50 })
  newStatus!: 'PENDING' | 'ACTIVE' | 'FROZEN' | 'CLOSED';

  /**
   * Reason for the status change.
   */
  @Column({ type: 'varchar', length: 255 })
  reason!: string;

  /**
   * Optional user who performed the change.
   */
  @Column({ type: 'uuid', nullable: true })
  changedByUserId?: string;

  /**
   * When this history record was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
