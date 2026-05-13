import { NestFactory } from '@nestjs/core';
import { AuditLogServiceModule } from './audit-log-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuditLogServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
