import { IsIn, IsUUID } from 'class-validator';

/**
 * Metadata sent together with a KYC document upload.
 */
export class UploadKycDocumentDto {
  /**
   * User who owns the document.
   */
  @IsUUID()
  userId!: string;

  /**
   * Type of KYC document being uploaded.
   */
  @IsIn(['GOVERNMENT_ID', 'PROOF_OF_ADDRESS', 'SELFIE'])
  documentType!: 'GOVERNMENT_ID' | 'PROOF_OF_ADDRESS' | 'SELFIE';
}
