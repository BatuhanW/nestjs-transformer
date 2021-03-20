import { Injectable } from '@nestjs/common';
import { BaseDestination } from '../destination/base.destination';
import { BaseEnricher } from '../enricher/base.enricher';
import { BaseTransformer } from '../transformer/base.transformer';

@Injectable()
export class BaseHandler<IncomingPayload = Record<string, any>> {
  protected transformer: BaseTransformer<Record<string, any>, Record<string, any>>;
  protected enricher: BaseEnricher<Record<string, any>, Promise<Record<string, any>>>;
  protected actions: BaseDestination<Record<string, any>>[];

  async handle(payload: IncomingPayload): Promise<void> {
    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] handling event for payload`, { ...payload }, '\n');
    const transformedPayload = this.transformer.perform(payload);
    console.log(`[${this.constructor.name}] transformed payload`, { ...transformedPayload }, '\n');

    const enrichedPayload = await this.enricher.perform(transformedPayload);
    console.log(`[${this.constructor.name}] enriched payload`, { ...enrichedPayload }, '\n');

    await Promise.all(
      this.actions.map((action) => {
        console.log(`[${this.constructor.name}] calling action ${action.constructor.name}`, '\n');

        action.perform(enrichedPayload);
      }),
    );
    console.log(`[${this.constructor.name}] handling completed.`);
    console.log('--------------------------------------------');
  }
}
