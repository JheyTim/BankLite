import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedMulterFile } from '@app/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from './entities/uploaded-file.entity';
import { UploadKycDocumentDto } from './dto/upload-kyc-document.dto';
import { FilePublisher } from './file.publisher';

/**
 * Contains file upload business logic.
 */
@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor(
    /**
     * File metadata repository.
     */
    @InjectRepository(UploadedFile)
    private readonly uploadedFileRepository: Repository<UploadedFile>,

    /**
     * Reads AWS/Floci config from environment variables.
     */
    private readonly configService: ConfigService,

    /**
     * Publishes file events.
     */
    private readonly filePublisher: FilePublisher,
  ) {
    /**
     * S3 client configured for Floci local AWS-compatible storage.
     */
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'ap-southeast-1'),
      endpoint: this.configService.get<string>('AWS_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
      forcePathStyle: true,
    });
  }

  /**
   * Uploads a KYC document to Floci S3 and saves metadata in PostgreSQL.
   */
  async uploadKycDocument(dto: UploadKycDocumentDto, file: UploadedMulterFile) {
    /**
     * Bucket configured for KYC documents.
     */
    const bucket = this.configService.get<string>('AWS_KYC_DOCUMENTS_BUCKET')!;

    /**
     * Generate stable IDs for metadata and tracing.
     */
    const fileId = uuidv4();
    const eventId = uuidv4();
    const correlationId = uuidv4();

    /**
     * Object key keeps files organized by user and document type.
     */
    const objectKey = `users/${dto.userId}/kyc/${dto.documentType}/${fileId}-${file.originalname}`;

    /**
     * Upload file bytes to local Floci S3.
     */
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    /**
     * Save file metadata to PostgreSQL.
     */
    const uploadedFile = this.uploadedFileRepository.create({
      id: fileId,
      userId: dto.userId,
      purpose: 'KYC_DOCUMENT',
      documentType: dto.documentType,
      bucket,
      objectKey,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });

    const savedFile = await this.uploadedFileRepository.save(uploadedFile);

    /**
     * Notify KYC Service that a KYC document was uploaded.
     */
    await this.filePublisher.publishFileUploaded({
      fileId: savedFile.id,
      userId: savedFile.userId,
      purpose: savedFile.purpose,
      documentType: savedFile.documentType,
      bucket: savedFile.bucket,
      objectKey: savedFile.objectKey,
      originalName: savedFile.originalName,
      mimeType: savedFile.mimeType,
      sizeBytes: savedFile.sizeBytes,
      eventId,
      correlationId,
      createdAt: savedFile.createdAt.toISOString(),
    });

    return savedFile;
  }
}
