import { Test, TestingModule } from '@nestjs/testing';
import { HappyHandler } from './happy.handler';
import { HappyDestination } from './happy.destination';

import { emptyTransformer, emptyEnricher, payloads } from './fixtures';
import { HappyTransformer } from './happy.transformer';
import { HappyEnricher } from './happy.enricher';

describe('BaseHandler', () => {
  let handler: HappyHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HappyTransformer, HappyEnricher, HappyDestination, HappyHandler],
    })
      .overrideProvider(HappyTransformer)
      .useValue(emptyTransformer)
      .overrideProvider(HappyEnricher)
      .useValue(emptyEnricher)
      .compile();

    handler = module.get<HappyHandler>(HappyHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('Happy Path', () => {
    it('should be happy', async () => {
      const handlerOnStartSpy = jest.spyOn(HappyHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(emptyTransformer, 'validate');
      const tfOnSuccessSpy = jest.spyOn(emptyTransformer, 'onSuccess');

      const enValidateSpy = jest.spyOn(emptyEnricher, 'validate');
      const enOnSuccessSpy = jest.spyOn(emptyEnricher, 'onSuccess');

      await handler.handle(payloads.payload);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(payloads.payload);

      expect(tfValidateSpy).toHaveBeenCalledWith(payloads.payload);
      expect(tfOnSuccessSpy).toHaveBeenCalledWith(payloads.transformed);

      expect(enValidateSpy).toHaveBeenCalledWith(payloads.transformed);
      expect(enOnSuccessSpy).toHaveBeenCalledWith(payloads.enriched);
    });
  });
});
