import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { FileUploadedEvent } from '@app/contracts';
import { KycService } from './kyc.service';

/**
 * Consumes events relevant to KYC.
 */
@Controller()
export class KycConsumer {
  constructor(
    /**
     * Contains KYC business logic.
     */
    private readonly kycService: KycService,
  ) {}

  /**
   * Runs whenever File Service publishes file.uploaded.
   */
  @EventPattern('file.uploaded')
  async handleFileUploaded(@Payload() event: FileUploadedEvent) {
    await this.kycService.handleFileUploaded(event);
  }
}
