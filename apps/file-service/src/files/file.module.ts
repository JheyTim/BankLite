import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMqClientModule, KYC_EVENTS_QUEUE } from '@app/messaging';
import { UploadedFile } from './entities/uploaded-file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FilePublisher } from './file.publisher';

/**
 * File module for uploads and metadata.
 */
@Module({
  imports: [
    /**
     * Registers UploadedFile repository.
     */
    TypeOrmModule.forFeature([UploadedFile]),

    /**
     * Publishes file.uploaded events to KYC Service queue.
     */
    RabbitMqClientModule.register(KYC_EVENTS_QUEUE),
  ],
  controllers: [FileController],
  providers: [FileService, FilePublisher],
})
export class FileModule {}
