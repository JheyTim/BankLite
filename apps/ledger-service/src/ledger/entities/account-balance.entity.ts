import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Cached account balance.
 * Ledger entries remain the source of truth, but this table makes balance reads fast.
 */
@Entity({ name: 'account_balances', schema: 'ledger_schema' })
export class AccountBalance {
  /**
   * Account ID from Account Service.
   */
  @PrimaryColumn({ type: 'uuid' })
  accountId!: string;

  /**
   * User who owns this account.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * Available balance in minor units.
   */
  @Column({ type: 'bigint', default: 0 })
  availableBalanceMinor!: number;

  /**
   * Current balance in minor units.
   */
  @Column({ type: 'bigint', default: 0 })
  currentBalanceMinor!: number;

  /**
   * Currency code.
   */
  @Column({ type: 'varchar', length: 10 })
  currency!: 'PHP' | 'USD';

  /**
   * When balance row was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When balance row was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
