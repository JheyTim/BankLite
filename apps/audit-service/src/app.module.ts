import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { AuditServiceController } from './audit-service.controller';
import { AuditServiceService } from './audit-service.service';

@Module({
  imports: [SharedModule],
  controllers: [AuditServiceController],
  providers: [AuditServiceService],
})
export class AppModule {}
