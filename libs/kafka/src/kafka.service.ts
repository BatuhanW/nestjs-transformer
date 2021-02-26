import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Consumer, Kafka, KafkaConfig, ConsumerConfig } from 'kafkajs';
import { KAFKA_SUBSCRIBER_KEY } from './kafka-subscriber.decorator';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly kafkaConfig: KafkaConfig,
    private readonly consumerConfig: ConsumerConfig,
    private readonly discoveryService: DiscoveryService,
  ) {
    this.kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
    });

    this.consumer = this.kafka.consumer({
      groupId: this.consumerConfig.groupId,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();

    const providers = this.discoveryService.getProviders();

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

        const payload = JSON.parse(message.value.toString());
        try {
          subscribedHandlers.forEach(subEvent => {
            subEvent.provider.instance.handle(payload.payload);
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
