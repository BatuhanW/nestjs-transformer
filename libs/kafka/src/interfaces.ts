import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { ConsumerConfig, KafkaConfig } from 'kafkajs';

export interface KafkaModuleOptions {
  kafkaConfig: KafkaConfig;
  consumerConfig: ConsumerConfig;
}

export interface KafkaModuleOptionsFactory {
  createHttpOptions(): Promise<KafkaModuleOptions> | KafkaModuleOptions;
}

export interface KafkaModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<KafkaModuleOptionsFactory>;
  useClass?: Type<KafkaModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<KafkaModuleOptions> | KafkaModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export interface KafkaSubscriberDecoratorParams {
  topicName: string;
  filter?: <IncomingPayload extends Record<string, any>>(message: IncomingPayload) => boolean;
}
