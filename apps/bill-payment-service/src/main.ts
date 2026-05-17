import { NestFactory } from '@nestjs/core';
import { BillPaymentServiceModule } from './bill-payment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BillPaymentServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
