import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulerService {
  async schedule(payload: Record<string, any>): Promise<void> {
    console.log('Scheduling with payload', payload);
  }
}
