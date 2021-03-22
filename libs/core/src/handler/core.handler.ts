import { BaseTransformer } from '../transformer/base.transformer';
import { BaseEnricher } from '../enricher/base.enricher';
import { BaseDestination } from '../destination/base.destination';
import { onHandlerError } from '../interfaces';

export class CoreHandler implements onHandlerError {
  private defaultTransformer: BaseTransformer<Record<string, any>, Record<string, any>> = {
    validate: (_val) => ({ success: true }),
    perform: (val) => val,
  };
  private defaultEnricher: BaseEnricher<Record<string, any>, Record<string, any>> = {
    validate: (_val) => ({ success: true }),
    perform: async (val) => val,
  };

  protected transformer?: BaseTransformer<Record<string, any>, Record<string, any>> = this
    .defaultTransformer;
  protected enricher?: BaseEnricher<Record<string, any>, Record<string, any>> = this
    .defaultEnricher;
  protected destinations: BaseDestination<Record<string, any>>[];

  onHandlerError(error: Error): void | Promise<void> {
    console.dir({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      class_name: this.constructor.name,
      error,
    });
  }
}
