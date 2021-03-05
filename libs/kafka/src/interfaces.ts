import { ConsumerConfig, KafkaConfig } from 'kafkajs';

export interface KafkaModuleRegisterOptions {
  kafkaConfig: KafkaConfig;
  consumerConfig: ConsumerConfig;
}

export interface KafkaSubscriberDecoratorParams {
  topicName: string;
  filter?: (message: Record<string, any>) => boolean;
}