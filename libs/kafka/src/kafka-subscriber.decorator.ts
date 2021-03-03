import { SetMetadata } from '@nestjs/common';

import { KAFKA_SUBSCRIBER_KEY } from './constants';
import { KafkaSubscriberDecoratorParams } from './interfaces';

export const KafkaSubscriber = (params: KafkaSubscriberDecoratorParams) =>
  SetMetadata<string, KafkaSubscriberDecoratorParams>(KAFKA_SUBSCRIBER_KEY, params);
