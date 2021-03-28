import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import { transformers, enrichers, destinations, fixtures } from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

import { EnricherValidationError } from '../../src/handler/errors';

describe('Enricher Fail', () => {
  let handler: TestHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
    })
      .overrideProvider(TestTransformer)
      .useValue(transformers.success)
      .overrideProvider(TestEnricher)
      .useValue(enrichers.fail)
      .overrideProvider(TestDestination)
      .useValue(destinations.success)
      .compile();

    handler = module.get<TestHandler>(TestHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('Validation error', () => {
    it('should throw error and stop execution', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.success, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.success, 'perform');
      const tfOnSuccessSpy = jest.spyOn(transformers.success, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.fail, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.fail, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.fail, 'onSuccess');

      const destPerformSpy = jest.spyOn(destinations.success, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.success, 'onSuccess');

      await expect(handler.handle(fixtures.payload)).rejects.toThrowError(EnricherValidationError);

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

      expect(enPerformSpy).not.toHaveBeenCalledWith(fixtures.transformed);
      expect(enPerformSpy).not.toHaveBeenCalledTimes(1);

      expect(enOnSuccessSpy).not.toHaveBeenCalledWith(fixtures.enriched);
      expect(enOnSuccessSpy).not.toHaveBeenCalledTimes(1);

      expect(destPerformSpy).not.toHaveBeenCalledWith(fixtures.enriched);
      expect(destPerformSpy).not.toHaveBeenCalledTimes(1);

      expect(destOnSuccessSpy).not.toHaveBeenCalledTimes(1);
    });
  });
});
