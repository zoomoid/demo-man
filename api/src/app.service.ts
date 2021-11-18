import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealthz(): string {
    return 'OK';
  }

  getReadyz(): string {
    return 'Ready';
  }

  getLivez(): string {
    return 'Alive';
  }
}
