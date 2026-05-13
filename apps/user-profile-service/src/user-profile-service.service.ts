import { Injectable } from '@nestjs/common';

@Injectable()
export class UserProfileServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
