import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Consumer, Kafka } from 'kafkajs';

import { KAFKA_MODULE_REGISTER_OPTIONS, KAFKA_SUBSCRIBER_KEY } from './constants';
import { KafkaModuleRegisterOptions } from './interfaces';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    @Inject(KAFKA_MODULE_REGISTER_OPTIONS)
    private readonly kafkaModuleRegisterOptions: KafkaModuleRegisterOptions,
    private readonly discoveryService: DiscoveryService,
  ) {
    const { kafkaConfig, consumerConfig } = this.kafkaModuleRegisterOptions;

    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });

    this.consumer = this.kafka.consumer({
      groupId: consumerConfig.groupId,
    });
  }

  async onModuleInit(): Promise<void> {
    this.consumer.connect();

    const providers = this.discoveryService.getProviders();

    console.log(providers)

    const topicSubscribers = new Map();

    providers.forEach(provider => {
      if (!provider.metatype) return;

      const kafkaSubscriberOptions = Reflect.getMetadata(
        KAFKA_SUBSCRIBER_KEY,
        provider.metatype,
      );

      if (kafkaSubscriberOptions) {
        const existingTopicSubscribers =
          topicSubscribers.get(kafkaSubscriberOptions.topicName) || [];

        topicSubscribers.set(kafkaSubscriberOptions.topicName, [
          ...existingTopicSubscribers,
          { provider, options: kafkaSubscriberOptions },
        ]);
      }
    });

    topicSubscribers.forEach(async (_eventNames, topicName) => {
      await this.subscribeToTopic(topicName);
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const subscribedHandlers = topicSubscribers.get(topic);

        const messageObject = JSON.parse(message.value.toString());

        try {
          subscribedHandlers
            .filter(({ options: { filter } }) => filter ? filter(message) : true)
            .forEach(({ provider }) => {
              provider.instance.handle(messageObject.payload);
            });
        } catch (e) {
          console.error(e);
        }
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }

  async subscribeToTopic(topic: string) {
    await this.consumer.subscribe({ topic, fromBeginning: false });
  }
}
