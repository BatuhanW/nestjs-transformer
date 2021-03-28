import { Test, TestingModule } from '@nestjs/testing';
import { HappyHandler } from './happy.handler';
import { HappyDestination } from './happy.destination';

import { happyTransformer, happyEnricher, happyPayloads, happyDestination } from './fixtures';
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
      const tfPerformSpy = jest.spyOn(happyTransformer, 'perform');
      const tfOnSuccessSpy = jest.spyOn(happyTransformer, 'onSuccess');

      const enValidateSpy = jest.spyOn(happyEnricher, 'validate');
      const enPerformSpy = jest.spyOn(happyEnricher, 'perform');
      const enOnSuccessSpy = jest.spyOn(happyEnricher, 'onSuccess');

      const destPerformSpy = jest.spyOn(happyDestination, 'perform');
      const destOnSuccessSpy = jest.spyOn(happyDestination, 'onSuccess');

      await handler.handle(happyPayloads.payload);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(happyPayloads.payload);

      expect(tfValidateSpy).toHaveBeenCalledWith(happyPayloads.payload);
      expect(tfPerformSpy).toHaveBeenCalledWith(happyPayloads.payload);

      expect(tfOnSuccessSpy).toHaveBeenCalledWith(happyPayloads.transformed);

      expect(enValidateSpy).toHaveBeenCalledWith(happyPayloads.transformed);
      expect(enPerformSpy).toHaveBeenCalledWith(happyPayloads.transformed);
      expect(enOnSuccessSpy).toHaveBeenCalledWith(happyPayloads.enriched);

      expect(destPerformSpy).toHaveBeenCalledWith(happyPayloads.enriched);
      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
