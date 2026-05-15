import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { KycService } from './kyc.service';
import { ReviewKycDto } from './dto/review-kyc.dto';

/**
 * Handles manual KYC review requests.
 */
@Controller('kyc')
export class KycController {
  constructor(
    /**
     * Contains KYC business logic.
     */
    private readonly kycService: KycService,
  ) {}

  /**
   * Lists KYC cases.
   */
  @Get('cases')
  async listCases() {
    return this.kycService.listCases();
  }

  /**
   * Reads one KYC case.
   */
  @Get('cases/:id')
  async getCase(@Param('id') id: string) {
    return this.kycService.getCase(id);
  }

  /**
   * Approves one KYC case.
   */
  @Patch('cases/:id/approve')
  async approveCase(@Param('id') id: string, @Body() dto: ReviewKycDto) {
    return this.kycService.approveCase(id, dto);
  }

  /**
   * Rejects one KYC case.
   */
  @Patch('cases/:id/reject')
  async rejectCase(@Param('id') id: string, @Body() dto: ReviewKycDto) {
    return this.kycService.rejectCase(id, dto);
  }
}
