import { Injectable } from '@nestjs/common';
import { KafkaSubscriber } from '@adapters/kafka';

@Injectable()
export class SchedulerService {
  @KafkaSubscriber({
    topicName: 'risk.users.queue',
    filter: (payload) => payload.event_name === 'id_check_request',
  })
  async schedule(payload: Record<string, any>): Promise<void> {
    console.log('Scheduling with payload', payload);
  }
}
