import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileUploadedEvent } from '@app/contracts';
import { BANKLITE_RABBITMQ_CLIENT } from '@app/messaging';

/**
 * Publishes file-related events.
 */
@Injectable()
export class FilePublisher {
  constructor(
    /**
     * RabbitMQ client used to publish events.
     */
    @Inject(BANKLITE_RABBITMQ_CLIENT)
    private readonly rabbitClient: ClientProxy,
  ) {}

  /**
   * Publishes file.uploaded after a file is stored successfully.
   */
  async publishFileUploaded(event: FileUploadedEvent): Promise<void> {
    await this.rabbitClient.emit('file.uploaded', event).toPromise();
  }
}
