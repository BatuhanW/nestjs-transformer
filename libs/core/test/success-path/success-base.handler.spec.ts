import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import {
  transformers,
  enrichers,
  destinationTransformers,
  destinations,
  fixtures,
} from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

describe('BaseHandler', () => {
  let handler: TestHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
    })
      .overrideProvider(TestTransformer)
      .useValue(transformers.success)
      .overrideProvider(TestEnricher)
      .useValue(enrichers.success)
      .overrideProvider(TestDestination)
      .useValue(destinations.success)
      .compile();

    handler = module.get<TestHandler>(TestHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('Test Path', () => {
    it('should be success', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.success, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.success, 'perform');
      const tfOnSuccessSpy = jest.spyOn(transformers.success, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.success, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.success, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.success, 'onSuccess');

      const destTfPerformSpy = jest.spyOn(destinationTransformers.success, 'perform');
      const destPerformSpy = jest.spyOn(destinations.success, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.success, 'onSuccess');

      await handler.handle(fixtures.payload);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(1);

      expect(tfPerformSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(tfPerformSpy).toHaveBeenCalledTimes(1);

      expect(tfOnSuccessSpy).toHaveBeenCalledWith(fixtures.transformed);
      expect(tfOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(enValidateSpy).toHaveBeenCalledWith(fixtures.transformed);
      expect(enValidateSpy).toHaveBeenCalledTimes(1);

      expect(enPerformSpy).toHaveBeenCalledWith(fixtures.transformed);
      expect(enPerformSpy).toHaveBeenCalledTimes(1);

      expect(enOnSuccessSpy).toHaveBeenCalledWith(fixtures.enriched);
      expect(enOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(destTfPerformSpy).toHaveBeenCalledWith(fixtures.enriched);
      expect(destTfPerformSpy).toHaveBeenCalledTimes(1);

      expect(destPerformSpy).toHaveBeenCalledWith(fixtures.destTransformed);
      expect(destPerformSpy).toHaveBeenCalledTimes(1);

      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
