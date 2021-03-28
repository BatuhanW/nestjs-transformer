import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import { transformers, enrichers, fixtures, destinations } from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

describe('BaseHandler', () => {
  let handler: TestHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
    })
      .overrideProvider(TestTransformer)
      .useValue(transformers.happy)
      .overrideProvider(TestEnricher)
      .useValue(enrichers.happy)
      .overrideProvider(TestDestination)
      .useValue(destinations.happy)
      .compile();

    handler = module.get<TestHandler>(TestHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('Test Path', () => {
    it('should be happy', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.happy, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.happy, 'perform');
      const tfOnSuccessSpy = jest.spyOn(transformers.happy, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.happy, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.happy, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.happy, 'onSuccess');

      const destPerformSpy = jest.spyOn(destinations.happy, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.happy, 'onSuccess');

      await handler.handle(fixtures.happy.payload);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.happy.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(fixtures.happy.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(1);

      expect(tfPerformSpy).toHaveBeenCalledWith(fixtures.happy.payload);
      expect(tfPerformSpy).toHaveBeenCalledTimes(1);

      expect(tfOnSuccessSpy).toHaveBeenCalledWith(fixtures.happy.transformed);
      expect(tfOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(enValidateSpy).toHaveBeenCalledWith(fixtures.happy.transformed);
      expect(enValidateSpy).toHaveBeenCalledTimes(1);

      expect(enPerformSpy).toHaveBeenCalledWith(fixtures.happy.transformed);
      expect(enPerformSpy).toHaveBeenCalledTimes(1);

      expect(enOnSuccessSpy).toHaveBeenCalledWith(fixtures.happy.enriched);
      expect(enOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(destPerformSpy).toHaveBeenCalledWith(fixtures.happy.enriched);
      expect(destPerformSpy).toHaveBeenCalledTimes(1);

      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
