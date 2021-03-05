import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ActionDecoratorParams, ACTION_KEY } from '../action/action.decorator';
import {
  EnricherDecoratorParams,
  ENRICHER_KEY,
} from '../enricher/enricher.decorator';
import { BaseAction } from '../action/base.action';
import {
  TransformerDecoratorParams,
  TRANSFORMER_KEY,
} from '../transformer/transformer.decorator';
import { BaseEnricher } from '../enricher/base.enricher';
import { BaseTransformer } from '../transformer/base.transformer';

@Injectable()
export class BaseHandler implements OnModuleInit {
  constructor(private readonly discoveryService: DiscoveryService) {}

  private transformer: BaseTransformer<Record<string, any>, Record<string, any>>;
  private enricher: BaseEnricher<Record<string, any>, Promise<Record<string, any>>>;
  private actions: BaseAction<Record<string, any>>[] = [];

  async handle(payload: Record<string, any>): Promise<void> {
    console.log('Handlinggg', this);
    const transformedPayload =  this.transformer.perform(payload);

    const enrichedPayload = await this.enricher.perform(transformedPayload);

    await Promise.all(
      this.actions.map((action) => action.perform(enrichedPayload)),
    );
  }

  onModuleInit(): void {
    if (this.constructor.name === 'BaseHandler') return;

    console.log('Getting providers', this.constructor.name);
    const providers = this.discoveryService.getProviders();
    console.log('Got providers');

    providers.forEach((provider) => {
      if (!provider.metatype) return;

      const transformerDecoratorParams: TransformerDecoratorParams = Reflect.getMetadata(
        TRANSFORMER_KEY,
        provider.metatype,
      );

      if (
        transformerDecoratorParams?.handlers.includes(this.constructor.name)
      ) {
        this.transformer = provider.instance;
      }

      const enricherDecoratorParams: EnricherDecoratorParams = Reflect.getMetadata(
        ENRICHER_KEY,
        provider.metatype,
      );

      if (enricherDecoratorParams?.handlers.includes(this.constructor.name)) {
        this.enricher = provider.instance;
      }

      const actionDecoratorParams: ActionDecoratorParams = Reflect.getMetadata(
        ACTION_KEY,
        provider.metatype,
      );

      if (actionDecoratorParams?.handlers.includes(this.constructor.name)) {
        this.actions.push(provider.instance);
      }
    });
  }
}
