import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { KycVerifiedEvent } from '@app/contracts';
import { AccountService } from './account.service';

/**
 * Consumes events related to account creation.
 */
@Controller()
export class AccountConsumer {
  constructor(
    /**
     * Contains account business logic.
     */
    private readonly accountService: AccountService,
  ) {}

  /**
   * Runs whenever KYC Service publishes kyc.verified.
   */
  @EventPattern('kyc.verified')
  async handleKycVerified(@Payload() event: KycVerifiedEvent) {
    await this.accountService.createAccountFromKycVerified(event);
  }
}
