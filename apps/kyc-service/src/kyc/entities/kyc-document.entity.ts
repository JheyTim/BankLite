import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * KYC document metadata linked to a KYC case.
 */
@Entity({ name: 'kyc_documents', schema: 'kyc_schema' })
export class KycDocument {
  /**
   * Unique KYC document ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * KYC case that owns this document.
   */
  @Index()
  @Column({ type: 'uuid' })
  kycCaseId!: string;

  /**
   * File metadata ID from File Service.
   */
  @Index({ unique: true })
  @Column({ type: 'uuid' })
  fileId!: string;

  /**
   * User who owns the document.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * KYC document type.
   */
  @Column({ type: 'varchar', length: 50 })
  documentType!: 'GOVERNMENT_ID' | 'PROOF_OF_ADDRESS' | 'SELFIE';

  /**
   * Bucket where the file is stored.
   */
  @Column({ type: 'varchar', length: 255 })
  bucket!: string;

  /**
   * Object key inside the bucket.
   */
  @Column({ type: 'varchar', length: 500 })
  objectKey!: string;

  /**
   * When document metadata was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
