import { Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { BaseTransformer } from '../transformer/base.transformer';
import { BaseEnricher } from '../enricher/base.enricher';
import { BaseDestination } from '../destination/base.destination';

@Injectable()
export class BaseHandler<IncomingPayload = Record<string, any>> {
  protected transformer?: BaseTransformer<Record<string, any>, Record<string, any>>;
  protected enricher?: BaseEnricher<Record<string, any>, Promise<Record<string, any>>>;
  protected destinations: BaseDestination<Record<string, any>>[];

  async handle(payload: IncomingPayload): Promise<void> {
    console.log('--------------------------------------------');
    console.log(`[${this.constructor.name}] handling event for payload`, { ...payload }, '\n');
    of(payload)
      .pipe(
        map((val) => (this.transformer ? this.transformer.perform(val) : val)),
        tap((val) =>
          console.log(`[${this.constructor.name}] transformed payload`, { ...val }, '\n'),
        ),
        mergeMap((val) => (this.enricher ? this.enricher.perform(val) : Promise.resolve(val))),
        tap((val) => console.log(`[${this.constructor.name}] enriched payload`, { ...val }, '\n')),
      )
      .forEach((val) =>
        Promise.all(
          this.destinations.map((destination) => {
            console.log(
              `[${this.constructor.name}] calling destination ${destination.constructor.name}`,
              '\n',
            );
            return destination.perform(val);
          }),
        ),
      );

    console.log(`[${this.constructor.name}] handling completed.`);
    console.log('--------------------------------------------');
  }
}
