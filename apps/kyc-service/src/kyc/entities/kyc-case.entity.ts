import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * KYC case owned by KYC Service.
 */
@Entity({ name: 'kyc_cases', schema: 'kyc_schema' })
export class KycCase {
  /**
   * Unique KYC case ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * User being verified.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * Current KYC status.
   */
  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

  /**
   * Reviewer who approved or rejected this case.
   */
  @Column({ type: 'uuid', nullable: true })
  reviewedByUserId?: string;

  /**
   * Rejection reason when status is REJECTED.
   */
  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  /**
   * Review timestamp.
   */
  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  /**
   * When case was created.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When case was last updated.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
