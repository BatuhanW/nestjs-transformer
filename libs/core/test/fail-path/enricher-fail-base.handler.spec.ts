import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import { transformers, enrichers, destinations, fixtures } from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

import { EnricherValidationError } from '../../src/handler/errors';

describe('Enricher Fail', () => {
  let handler: TestHandler;

  beforeEach(() => {});

  afterEach(() => {});

  describe('Validation error', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
      })
        .overrideProvider(TestTransformer)
        .useValue(transformers.success)
        .overrideProvider(TestEnricher)
        .useValue(enrichers.fail.validation)
        .overrideProvider(TestDestination)
        .useValue(destinations.success)
        .compile();

      handler = module.get<TestHandler>(TestHandler);
    });

    it('should throw error and stop execution', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.success, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.success, 'perform');
      const tfOnSuccessSpy = jest.spyOn(transformers.success, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.fail.validation, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.fail.validation, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.fail.validation, 'onSuccess');

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

      expect(enPerformSpy).not.toHaveBeenCalled();

      expect(enOnSuccessSpy).not.toHaveBeenCalled();

      expect(destPerformSpy).not.toHaveBeenCalled();

      expect(destOnSuccessSpy).not.toHaveBeenCalled();
    });
  });

  describe('Unhandled error', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
      })
        .overrideProvider(TestTransformer)
        .useValue(transformers.success)
        .overrideProvider(TestEnricher)
        .useValue(enrichers.fail.unHandled)
        .overrideProvider(TestDestination)
        .useValue(destinations.success)
        .compile();

      handler = module.get<TestHandler>(TestHandler);
    });

    it('should throw error and stop execution', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.success, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.success, 'perform');
      const tfOnSuccessSpy = jest.spyOn(transformers.success, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.fail.unHandled, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.fail.unHandled, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.fail.unHandled, 'onSuccess');

      const destPerformSpy = jest.spyOn(destinations.success, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.success, 'onSuccess');

      await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
        TypeError("Cannot read property 'enricherFail' of undefined"),
      );

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

      expect(enOnSuccessSpy).not.toHaveBeenCalled();

      expect(destPerformSpy).not.toHaveBeenCalled();

      expect(destOnSuccessSpy).not.toHaveBeenCalled();
    });
  });
});
