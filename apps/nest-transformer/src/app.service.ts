import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHealth(): string {
    return 'OK';
  }

  getWhoAmI(): string {
    const nodeEnv = this.configService.get('NODE_ENV');
    const port = this.configService.get('PORT');

    return `OK:${nodeEnv}:${port}`;
  }
}
