import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Biller that can receive bill payments.
 */
@Entity({ name: 'billers', schema: 'bill_payment_schema' })
export class Biller {
  /**
   * Unique biller ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Human-readable biller name.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /**
   * Category of biller.
   */
  @Column({ type: 'varchar', length: 100 })
  category!:
    | 'ELECTRICITY'
    | 'WATER'
    | 'INTERNET'
    | 'MOBILE'
    | 'GOVERNMENT'
    | 'OTHER';

  /**
   * Whether this biller can receive payments.
   */
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * When biller was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When biller was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
