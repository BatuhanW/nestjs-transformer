import { Test, TestingModule } from '@nestjs/testing';
import { HappyHandler } from './happy.handler';
import { HappyDestination } from './happy.destination';

import { happyTransformer, happyEnricher, payloads, happyDestination } from './fixtures';
import { HappyTransformer } from './happy.transformer';
import { HappyEnricher } from './happy.enricher';

describe('BaseHandler', () => {
  let handler: HappyHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HappyTransformer, HappyEnricher, HappyDestination, HappyHandler],
    })
      .overrideProvider(HappyTransformer)
      .useValue(happyTransformer)
      .overrideProvider(HappyEnricher)
      .useValue(happyEnricher)
      .overrideProvider(HappyDestination)
      .useValue(happyDestination)
      .compile();

    handler = module.get<HappyHandler>(HappyHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('Happy Path', () => {
    it('should be happy', async () => {
      const handlerOnStartSpy = jest.spyOn(HappyHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(happyTransformer, 'validate');
      const tfOnSuccessSpy = jest.spyOn(happyTransformer, 'onSuccess');

      const enValidateSpy = jest.spyOn(happyEnricher, 'validate');
      const enOnSuccessSpy = jest.spyOn(happyEnricher, 'onSuccess');

      const destOnSuccessSpy = jest.spyOn(happyDestination, 'onSuccess');

      await handler.handle(payloads.payload);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(payloads.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(payloads.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(2);

      expect(tfOnSuccessSpy).toHaveBeenCalledWith(payloads.transformed);
      expect(tfOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(enValidateSpy).toHaveBeenCalledWith(payloads.transformed);
      expect(enValidateSpy).toHaveBeenCalledTimes(2);

      expect(enOnSuccessSpy).toHaveBeenCalledTimes(1);
      expect(enOnSuccessSpy).toHaveBeenCalledWith(payloads.enriched);

      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
