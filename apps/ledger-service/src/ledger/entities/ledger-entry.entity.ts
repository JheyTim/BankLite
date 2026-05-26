import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Append-only ledger entry.
 * Every money movement must have matching debit and credit entries.
 */
@Entity({ name: 'ledger_entries', schema: 'ledger_schema' })
export class LedgerEntry {
  /**
   * Unique ledger entry ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Parent ledger transaction ID.
   */
  @Index()
  @Column({ type: 'uuid' })
  ledgerTransactionId!: string;

  /**
   * Account affected by this entry.
   */
  @Index()
  @Column({ type: 'uuid' })
  accountId!: string;

  /**
   * Entry direction.
   */
  @Column({ type: 'varchar', length: 20 })
  direction!: 'DEBIT' | 'CREDIT';

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
   * When this entry was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
