import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Consumer, Kafka } from 'kafkajs';

import { KAFKA_MODULE_REGISTER_OPTIONS, KAFKA_SUBSCRIBER_KEY } from './constants';
import { KafkaModuleRegisterOptions, KafkaSubscriberDecoratorParams } from './interfaces';

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

    this.kafka = new Kafka(kafkaConfig);

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  async connect(): Promise<void> {
    await this.disconnect();
    await this.consumer.connect();

    const providers = this.discoveryService.getProviders();

    const topicSubscribers = new Map<
      string,
      { provider: InstanceWrapper; options: KafkaSubscriberDecoratorParams }[]
    >();

    providers.forEach((provider) => {
      if (!provider.metatype) return;

      const kafkaSubscriberOptions = Reflect.getMetadata(KAFKA_SUBSCRIBER_KEY, provider.metatype);

      if (kafkaSubscriberOptions) {
        const existingTopicSubscribers =
          topicSubscribers.get(kafkaSubscriberOptions.topicName) || [];

        topicSubscribers.set(kafkaSubscriberOptions.topicName, [
          ...existingTopicSubscribers,
          { provider, options: kafkaSubscriberOptions },
        ]);

        console.log('--------------------------------------------');
        console.log('[Kafka Service] Found provider', provider.name);
        console.log('--------------------------------------------', '\n');
      }
    });

    for (const [topicName, data] of topicSubscribers) {
      console.log('--------------------------------------------');
      console.log(`[Kafka Service] Subscribing to ${topicName}`);
      data.map(({ provider }) => console.log('For', provider.name));
      console.log('--------------------------------------------');
      await this.subscribeToTopic(topicName);
    }

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const subscribedHandlers = topicSubscribers.get(topic);

        const messageObject = JSON.parse(message.value.toString());

        console.log('--------------------------------------------');
        console.log('[Kafka Service] Received payload', { ...messageObject });
        console.log('--------------------------------------------');

        try {
          subscribedHandlers
            .filter(({ options: { filter } }) => (filter ? filter(messageObject) : true))
            .forEach(({ provider }) => {
              provider.instance.handle(messageObject.payload);
            });
        } catch (e) {
          console.error(e);
        }
      },
    });

    console.log('[Kafka Service] Initialized');
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  async onModuleInit(): Promise<void> {
    this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async subscribeToTopic(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });
  }
}
