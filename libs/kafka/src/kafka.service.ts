import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Consumer, Kafka } from 'kafkajs';

import { KAFKA_MODULE_OPTIONS, KAFKA_SUBSCRIBER_KEY } from './constants';
import { KafkaModuleOptions, KafkaSubscriberDecoratorParams } from './interfaces';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    @Inject(KAFKA_MODULE_OPTIONS)
    private readonly kafkaModuleRegisterOptions: KafkaModuleOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {
    const { kafkaConfig, consumerConfig } = this.kafkaModuleRegisterOptions;

    this.kafka = new Kafka(kafkaConfig);

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  async onModuleInit(): Promise<void> {
    this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    await this.disconnect();
    await this.consumer.connect();

    const providers = this.discoveryService.getProviders();

    const topicSubscribers = new Map<
      string,
      {
        provider: InstanceWrapper;
        options: KafkaSubscriberDecoratorParams;
        methodName?: string | symbol;
      }[]
    >();

    providers
      .filter((p) => !!p.metatype)
      .forEach((provider) => {
        // const kafkaSubscriberOptions = Reflect.getMetadata(KAFKA_SUBSCRIBER_KEY, provider.metatype);

        let kafkaSubscriberOptions = this.reflector.get(KAFKA_SUBSCRIBER_KEY, provider.metatype);
        let methodName: (string | symbol) | undefined;

        if (!kafkaSubscriberOptions && provider.instance) {
          const proto = Object.getPrototypeOf(provider.instance);
          if (proto) {
            const keyz = Reflect.ownKeys(proto);

            keyz.map((k) => {
              if (provider.instance[k]) {
                console.log();
                const options = this.reflector.get(KAFKA_SUBSCRIBER_KEY, provider.instance[k]);
                if (options) {
                  kafkaSubscriberOptions = options;
                  methodName = k;
                }
              }
            });
          }
        }

        if (kafkaSubscriberOptions) {
          const existingTopicSubscribers =
            topicSubscribers.get(kafkaSubscriberOptions.topicName) || [];

          topicSubscribers.set(kafkaSubscriberOptions.topicName, [
            ...existingTopicSubscribers,
            { provider, options: kafkaSubscriberOptions, methodName },
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

        const filteredHandlers = subscribedHandlers.filter(({ options: { filter } }) =>
          filter ? filter(messageObject) : true,
        );

        await Promise.all(
          filteredHandlers.map(async ({ provider, methodName }) => {
            try {
              if (methodName) {
                return await provider.instance[methodName](messageObject);
              } else {
                return await provider.instance.handle(messageObject.payload);
              }
            } catch (e) {
              await provider.instance.onError(e);

              throw e;
            }
          }),
        ).catch(async (_) => {
          await this.disconnect();
          process.exit(0);
        });
      },
    });

    console.log('[Kafka Service] Initialized');
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  async subscribeToTopic(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });
  }
}
