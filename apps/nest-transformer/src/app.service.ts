import { Injectable } from '@nestjs/common';
import { SubscribeTo } from '@adapters/kafka';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // @SubscribeTo('test')
  // async test(payload: any) {
  //   console.log(JSON.parse(payload).test);
  // }
}
