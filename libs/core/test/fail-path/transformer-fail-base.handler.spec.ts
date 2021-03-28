import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import { transformers, enrichers, destinations, fixtures } from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

import { TransformerValidationError } from '../../src/handler/errors';

describe('Transformer Fail', () => {
  let handler: TestHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
    })
      .overrideProvider(TestTransformer)
      .useValue(transformers.fail)
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

  describe('Validation error', () => {
    it('should throw error and stop execution', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.fail, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.fail, 'perform');
      const tfOnSuccessSpy = jest.spyOn(transformers.fail, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.success, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.success, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.success, 'onSuccess');

      const destPerformSpy = jest.spyOn(destinations.success, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.success, 'onSuccess');

      await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
        TransformerValidationError,
      );

      expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(1);

      expect(tfPerformSpy).not.toHaveBeenCalledWith(fixtures.payload);
      expect(tfPerformSpy).not.toHaveBeenCalledTimes(1);

      expect(tfOnSuccessSpy).not.toHaveBeenCalledWith(fixtures.transformed);
      expect(tfOnSuccessSpy).not.toHaveBeenCalledTimes(1);

      expect(enValidateSpy).not.toHaveBeenCalledWith(fixtures.transformed);
      expect(enValidateSpy).not.toHaveBeenCalledTimes(1);

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
