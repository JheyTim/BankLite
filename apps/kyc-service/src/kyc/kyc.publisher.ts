import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { KycRejectedEvent, KycVerifiedEvent } from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes KYC review events.
 */
@Injectable()
export class KycPublisher {
  constructor(
    /**
     * RabbitMQ client used for event publishing.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes kyc.verified after approval.
   */
  async publishKycVerified(event: KycVerifiedEvent): Promise<void> {
    await this.rabbitClient.emit('kyc.verified', event).toPromise();
  }

  /**
   * Publishes kyc.rejected after rejection.
   */
  async publishKycRejected(event: KycRejectedEvent): Promise<void> {
    await this.rabbitClient.emit('kyc.rejected', event).toPromise();
  }
}
