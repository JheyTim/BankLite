import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileServiceController } from './user-profile-service.controller';
import { UserProfileServiceService } from './user-profile-service.service';

describe('UserProfileServiceController', () => {
  let userProfileServiceController: UserProfileServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileServiceController],
      providers: [UserProfileServiceService],
    }).compile();

    userProfileServiceController = app.get<UserProfileServiceController>(UserProfileServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userProfileServiceController.getHello()).toBe('Hello World!');
    });
  });
});
