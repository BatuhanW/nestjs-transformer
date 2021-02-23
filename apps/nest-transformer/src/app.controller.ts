import { Controller, Get } from '@nestjs/common';
import { SubscribeTo } from '@adapters/kafka';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @SubscribeTo('test')
  async test(payload: any) {
    console.log(JSON.parse(payload).test)
  }
}
