import { Test, TestingModule } from '@nestjs/testing';
import { BillPaymentServiceController } from './bill-payment-service.controller';
import { BillPaymentServiceService } from './bill-payment-service.service';

describe('BillPaymentServiceController', () => {
  let billPaymentServiceController: BillPaymentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BillPaymentServiceController],
      providers: [BillPaymentServiceService],
    }).compile();

    billPaymentServiceController = app.get<BillPaymentServiceController>(BillPaymentServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(billPaymentServiceController.getHello()).toBe('Hello World!');
    });
  });
});
