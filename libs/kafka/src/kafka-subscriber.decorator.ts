import { SetMetadata } from '@nestjs/common';

export const KAFKA_SUBSCRIBER_KEY = 'kafka-subscriber';

export interface KafkaSubscriberParams {
  topicName: string;
  eventName: string;
}

export const KafkaSubscriber = (params: KafkaSubscriberParams) =>
  SetMetadata<string, KafkaSubscriberParams>(KAFKA_SUBSCRIBER_KEY, params);