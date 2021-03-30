import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { KafkaSubscriber } from '@adapters/kafka';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class SchedulerService {
  constructor(@InjectQueue('scheduler') private schedulerProcessor: Queue) {}
  @KafkaSubscriber({
    topicName: 'risk.users.queue',
    filter: (payload) => payload.event_name === 'id_check_request',
  })
  async schedule(event: Record<string, any>): Promise<void> {
    console.log('Scheduling with payload');
    console.log(event);
    await this.schedulerProcessor.add('process', event.payload, {});
    console.log('Scheduled with payload');
  }
}
