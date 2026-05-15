import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadedEvent } from '@app/contracts';
import { KycCase } from './entities/kyc-case.entity';
import { KycDocument } from './entities/kyc-document.entity';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { KycPublisher } from './kyc.publisher';

/**
 * Contains KYC business logic.
 */
@Injectable()
export class KycService {
  constructor(
    /**
     * Repository for KYC cases.
     */
    @InjectRepository(KycCase)
    private readonly kycCaseRepository: Repository<KycCase>,

    /**
     * Repository for KYC documents.
     */
    @InjectRepository(KycDocument)
    private readonly kycDocumentRepository: Repository<KycDocument>,

    /**
     * Publishes KYC review events.
     */
    private readonly kycPublisher: KycPublisher,
  ) {}

  /**
   * Creates or updates a KYC case when a KYC document is uploaded.
   */
  async handleFileUploaded(event: FileUploadedEvent) {
    /**
     * Ignore non-KYC file uploads.
     */
    if (event.purpose !== 'KYC_DOCUMENT') {
      return;
    }

    if (!event.documentType) {
      throw new BadRequestException('KYC document type is required.');
    }

    /**
     * Idempotency check: do not create duplicate KYC documents for the same file.
     */
    const existingDocument = await this.kycDocumentRepository.findOne({
      where: { fileId: event.fileId },
    });

    if (existingDocument) {
      return existingDocument;
    }

    /**
     * Find existing non-final KYC case for the user.
     */
    let kycCase = await this.kycCaseRepository.findOne({
      where: {
        userId: event.userId,
        status: 'PENDING',
      },
    });

    /**
     * Create a new KYC case if none exists.
     */
    if (!kycCase) {
      kycCase = this.kycCaseRepository.create({
        userId: event.userId,
        status: 'PENDING',
      });

      kycCase = await this.kycCaseRepository.save(kycCase);
    }

    /**
     * Save KYC document metadata.
     */
    const document = this.kycDocumentRepository.create({
      kycCaseId: kycCase.id,
      fileId: event.fileId,
      userId: event.userId,
      documentType: event.documentType,
      bucket: event.bucket,
      objectKey: event.objectKey,
    });

    return this.kycDocumentRepository.save(document);
  }

  /**
   * Lists all KYC cases.
   */
  async listCases() {
    return this.kycCaseRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Reads one KYC case.
   */
  async getCase(id: string) {
    const kycCase = await this.kycCaseRepository.findOne({
      where: { id },
    });

    if (!kycCase) {
      throw new NotFoundException('KYC case not found.');
    }

    return kycCase;
  }

  /**
   * Approves a KYC case and emits kyc.verified.
   */
  async approveCase(id: string, dto: ReviewKycDto) {
    const kycCase = await this.getCase(id);

    if (kycCase.status === 'VERIFIED') {
      return kycCase;
    }

    kycCase.status = 'VERIFIED';
    kycCase.reviewedByUserId = dto.reviewedByUserId;
    kycCase.reviewedAt = new Date();

    const savedCase = await this.kycCaseRepository.save(kycCase);

    await this.kycPublisher.publishKycVerified({
      kycCaseId: savedCase.id,
      userId: savedCase.userId,
      reviewedByUserId: dto.reviewedByUserId,
      eventId: uuidv4(),
      correlationId: uuidv4(),
      verifiedAt: savedCase.reviewedAt!.toISOString(),
    });

    return savedCase;
  }

  /**
   * Rejects a KYC case and emits kyc.rejected.
   */
  async rejectCase(id: string, dto: ReviewKycDto) {
    if (!dto.reason) {
      throw new BadRequestException('Rejection reason is required.');
    }

    const kycCase = await this.getCase(id);

    kycCase.status = 'REJECTED';
    kycCase.reviewedByUserId = dto.reviewedByUserId;
    kycCase.rejectionReason = dto.reason;
    kycCase.reviewedAt = new Date();

    const savedCase = await this.kycCaseRepository.save(kycCase);

    await this.kycPublisher.publishKycRejected({
      kycCaseId: savedCase.id,
      userId: savedCase.userId,
      reviewedByUserId: dto.reviewedByUserId,
      reason: dto.reason,
      eventId: uuidv4(),
      correlationId: uuidv4(),
      rejectedAt: savedCase.reviewedAt!.toISOString(),
    });

    return savedCase;
  }
}
