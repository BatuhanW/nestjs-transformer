import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { Consumer, Kafka, KafkaConfig, ConsumerConfig } from 'kafkajs';
import { wrap } from 'module';
import { KAFKA_SUBSCRIBER_KEY } from './kafka-subscriber.decorator';

import {
  SUBSCRIBER_FN_REF_MAP,
  SUBSCRIBER_OBJ_REF_MAP,
} from './kafka.decorator';

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

    const wrappers = this.discoveryService.getProviders();

    const subscribedServices = wrappers.filter(wrapper => {
      return (
        wrapper.metatype &&
        Reflect.getMetadata(KAFKA_SUBSCRIBER_KEY, wrapper.metatype)
      );
    });

    const topicsToSubscribe = new Map();

    subscribedServices.forEach(wrapper => {
      const options = Reflect.getMetadata(
        KAFKA_SUBSCRIBER_KEY,
        wrapper.metatype,
      );

      const existingNames = topicsToSubscribe.get(options.topicName) || [];

      topicsToSubscribe.set(options.topicName, [
        ...existingNames,
        { wrapper, options },
      ]);
    });

    topicsToSubscribe.forEach(async (_eventNames, topicName) => {
      await this.subscribeToTopic(topicName);
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const subscribedEvents = topicsToSubscribe.get(topic);

        const payload = JSON.parse(message.value.toString());
        try {
          subscribedEvents.forEach(subEvent => {
            console.log(subEvent);
            console.log(subEvent.wrapper.metatype);
            console.log(subEvent.wrapper.metatype['ee']);
            subEvent.wrapper.metatype.prototype.test(payload)
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
