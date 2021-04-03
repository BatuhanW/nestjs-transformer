import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import { transformers, enrichers, destinations, fixtures } from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

import { PerformableRuntimeError, PerformableValidationError } from '@core/errors';

describe('Transformer Fail', () => {
  let handler: TestHandler;

  describe('Validation error', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
      })
        .overrideProvider(TestTransformer)
        .useValue(transformers.fail.validation)
        .overrideProvider(TestEnricher)
        .useValue(enrichers.success)
        .overrideProvider(TestDestination)
        .useValue(destinations.success)
        .compile();

      handler = module.get<TestHandler>(TestHandler);
    });

    it('should throw error and stop execution', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.fail.validation, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.fail.validation, 'perform');
      const tfOnErrorSpy = jest.spyOn(transformers.fail.validation, 'onError');
      const tfOnSuccessSpy = jest.spyOn(transformers.fail.validation, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.success, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.success, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.success, 'onSuccess');

      const destPerformSpy = jest.spyOn(destinations.success, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.success, 'onSuccess');

      await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
        PerformableValidationError,
      );

      expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(1);

      expect(tfOnErrorSpy).toHaveBeenCalledWith(
        new PerformableValidationError('TestTransformer', fixtures.payload, 'Validation fail!'),
      );
      expect(tfOnErrorSpy).toHaveBeenCalledTimes(1);

      expect(tfPerformSpy).not.toHaveBeenCalled();

      expect(tfOnSuccessSpy).not.toHaveBeenCalled();

      expect(enValidateSpy).not.toHaveBeenCalled();

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
        .useValue(transformers.fail.unHandled)
        .overrideProvider(TestEnricher)
        .useValue(enrichers.success)
        .overrideProvider(TestDestination)
        .useValue(destinations.success)
        .compile();

      handler = module.get<TestHandler>(TestHandler);
    });

    it('should throw error and stop execution', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(transformers.fail.unHandled, 'validate');
      const tfPerformSpy = jest.spyOn(transformers.fail.unHandled, 'perform');
      const tfOnErrorSpy = jest.spyOn(transformers.fail.unHandled, 'onError');
      const tfOnSuccessSpy = jest.spyOn(transformers.fail.unHandled, 'onSuccess');

      const enValidateSpy = jest.spyOn(enrichers.success, 'validate');
      const enPerformSpy = jest.spyOn(enrichers.success, 'perform');
      const enOnSuccessSpy = jest.spyOn(enrichers.success, 'onSuccess');

      const destPerformSpy = jest.spyOn(destinations.success, 'perform');
      const destOnSuccessSpy = jest.spyOn(destinations.success, 'onSuccess');

      await expect(handler.handle(fixtures.payload)).rejects.toThrowError(PerformableRuntimeError);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(fixtures.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(1);

      expect(tfPerformSpy).toHaveBeenCalledWith(fixtures.payload);

      expect(tfOnErrorSpy).toHaveBeenCalledWith(
        new Error("Cannot read property 'transformerFail' of undefined"),
      );
      expect(tfOnErrorSpy).toHaveBeenCalledTimes(1);

      expect(tfOnSuccessSpy).not.toHaveBeenCalled();

      expect(enValidateSpy).not.toHaveBeenCalled();

      expect(enPerformSpy).not.toHaveBeenCalled();

      expect(enOnSuccessSpy).not.toHaveBeenCalled();

      expect(destPerformSpy).not.toHaveBeenCalled();

      expect(destOnSuccessSpy).not.toHaveBeenCalled();
    });
  });
});
