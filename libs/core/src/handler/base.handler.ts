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

  private transformer: BaseTransformer<
    Record<string, any>,
    Record<string, any>
  >;
  private enricher: BaseEnricher<
    Record<string, any>,
    Promise<Record<string, any>>
  >;
  private actions: BaseAction<Record<string, any>>[] = [];

  async handle(payload: Record<string, any>): Promise<void> {
    console.log('--------------------------------------------');
    console.log(
      `[${this.constructor.name}] handling event for payload`,
      { ...payload },
      '\n',
    );
    const transformedPayload = this.transformer.perform(payload);
    console.log(
      `[${this.constructor.name}] transformed payload`,
      { ...transformedPayload },
      '\n',
    );

    const enrichedPayload = await this.enricher.perform(transformedPayload);
    console.log(
      `[${this.constructor.name}] enriched payload`,
      { ...enrichedPayload },
      '\n',
    );

    await Promise.all(
      this.actions.map((action) => {
        console.log(
          `[${this.constructor.name}] calling action ${action.constructor.name}`,
          '\n',
        );

        action.perform(enrichedPayload);
      }),
    );
    console.log(`[${this.constructor.name}] handling completed.`);
    console.log('--------------------------------------------');
  }

  onModuleInit(): void {
    if (this.constructor.name === 'BaseHandler') return;

    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] Initialazing providers...`, '\n');

    const providers = this.discoveryService.getProviders();

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
        console.log(
          `[${this.constructor.name}]`,
          provider.name,
          'assigned',
          '\n',
        );
      }

      const enricherDecoratorParams: EnricherDecoratorParams = Reflect.getMetadata(
        ENRICHER_KEY,
        provider.metatype,
      );

      if (enricherDecoratorParams?.handlers.includes(this.constructor.name)) {
        this.enricher = provider.instance;
        console.log(
          `[${this.constructor.name}]`,
          provider.name,
          'assigned',
          '\n',
        );
      }

      const actionDecoratorParams: ActionDecoratorParams = Reflect.getMetadata(
        ACTION_KEY,
        provider.metatype,
      );

      if (actionDecoratorParams?.handlers.includes(this.constructor.name)) {
        this.actions.push(provider.instance);
        console.log(
          `[${this.constructor.name}]`,
          provider.name,
          'assigned',
          '\n',
        );
      }
    });

    console.log('--------------------------------------------', '\n');
  }
}
