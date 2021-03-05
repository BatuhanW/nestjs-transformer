import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { KAFKA_SUBSCRIBER_KEY } from './constants';
import { KafkaSubscriberDecoratorParams } from './interfaces';

export const KafkaSubscriber = (
  params: KafkaSubscriberDecoratorParams,
): CustomDecorator<typeof KAFKA_SUBSCRIBER_KEY> =>
  SetMetadata<typeof KAFKA_SUBSCRIBER_KEY, KafkaSubscriberDecoratorParams>(
    KAFKA_SUBSCRIBER_KEY,
    params,
  );
