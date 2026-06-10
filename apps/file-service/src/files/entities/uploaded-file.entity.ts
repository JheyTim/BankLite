import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * File metadata stored by File Service.
 * The actual file bytes are stored in Floci S3.
 */
@Entity({ name: 'uploaded_files', schema: 'file_schema' })
export class UploadedFile {
  /**
   * Unique file metadata ID.
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * User who owns this file.
   */
  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  /**
   * Business purpose of the uploaded file.
   */
  @Column({ type: 'varchar', length: 50 })
  purpose!: 'KYC_DOCUMENT' | 'SUPPORT_DOCUMENT' | 'STATEMENT';

  /**
   * KYC document type when purpose is KYC_DOCUMENT.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  documentType?: 'GOVERNMENT_ID' | 'PROOF_OF_ADDRESS' | 'SELFIE';

  /**
   * S3-style bucket name.
   */
  @Column({ type: 'varchar', length: 255 })
  bucket!: string;

  /**
   * Object key inside the bucket.
   */
  @Column({ type: 'varchar', length: 500 })
  objectKey!: string;

  /**
   * Original uploaded filename.
   */
  @Column({ type: 'varchar', length: 255 })
  originalName!: string;

  /**
   * File MIME type.
   */
  @Column({ type: 'varchar', length: 100 })
  mimeType!: string;

  /**
   * File size in bytes.
   */
  @Column({ type: 'integer' })
  sizeBytes!: number;

  /**
   * When metadata was created.
   */
  @CreateDateColumn()
  createdAt!: Date;
}
