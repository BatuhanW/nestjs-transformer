import { Test } from '@nestjs/testing';

import { TestTransformer, TestEnricher } from '../assets';
import { transformers, enrichers, fixtures } from '../fixtures';
import { TestHandlerWithEnricher, TestHandlerWithTransformer } from '../assets/test.handler';
import { BaseHandler, HandleStepRuntimeError, HandleStepValidationError } from '@core';

describe('#handler', () => {
  let handler: BaseHandler;

  describe('#step-handler', () => {
    let handleStepSpy;

    beforeEach(() => {
      handleStepSpy = jest.spyOn(BaseHandler, 'handleStep');
    });

    describe('#with-hooks', () => {
      describe('#success', () => {
        beforeEach(async () => {
          const module = await Test.createTestingModule({
            providers: [TestHandlerWithEnricher, TestEnricher],
          })
            .overrideProvider(TestEnricher)
            .useValue(enrichers.success)
            .compile();

          handler = module.get(TestHandlerWithEnricher);
        });

        it('should call stepHandler with enricher', async () => {
          expect.hasAssertions();

          const validateSpy = jest.spyOn(enrichers.success, 'validate');
          const performSpy = jest.spyOn(enrichers.success, 'perform');
          const onSuccessSpy = jest.spyOn(enrichers.success, 'onSuccess');

          await expect(handler.handle(fixtures.payload)).resolves.toStrictEqual(fixtures.enriched);

          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.success);
          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.enriched, undefined);

          expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
          expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          expect(onSuccessSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('#fail', () => {
        describe('#validation', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithEnricher, TestEnricher],
            })
              .overrideProvider(TestEnricher)
              .useValue(enrichers.fail.validation)
              .compile();

            handler = module.get(TestHandlerWithEnricher);
          });

          it('should not move forward', async () => {
            expect.hasAssertions();

            const validateSpy = jest.spyOn(enrichers.fail.validation, 'validate');
            const performSpy = jest.spyOn(enrichers.fail.validation, 'perform');
            const onSuccessSpy = jest.spyOn(enrichers.fail.validation, 'onSuccess');
            const onErrorSpy = jest.spyOn(enrichers.fail.validation, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(
              HandleStepValidationError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.fail.validation);
            expect(handleStepSpy).toHaveBeenCalledTimes(1);

            expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onErrorSpy).toHaveBeenCalledWith(
              new HandleStepValidationError(
                'TestTransformer',
                fixtures.payload,
                'Validation fail!',
              ),
            );
            expect(performSpy).not.toHaveBeenCalled();
            expect(onSuccessSpy).not.toHaveBeenCalled();
          });
        });

        describe('#unhandled', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithEnricher, TestEnricher],
            })
              .overrideProvider(TestEnricher)
              .useValue(enrichers.fail.unHandled)
              .compile();

            handler = module.get(TestHandlerWithEnricher);
          });

          it('should not move forward', async () => {
            expect.hasAssertions();

            const validateSpy = jest.spyOn(enrichers.fail.unHandled, 'validate');
            const performSpy = jest.spyOn(enrichers.fail.unHandled, 'perform');
            const onSuccessSpy = jest.spyOn(enrichers.fail.unHandled, 'onSuccess');
            const onErrorSpy = jest.spyOn(enrichers.fail.unHandled, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(HandleStepRuntimeError);

            expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.fail.unHandled);
            expect(handleStepSpy).toHaveBeenCalledTimes(1);

            expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onErrorSpy).toHaveBeenCalledWith(
              new Error("Cannot read property 'transformerFail' of undefined"),
            );
            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onSuccessSpy).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('#without-hooks', () => {
      describe('#success', () => {
        beforeEach(async () => {
          const module = await Test.createTestingModule({
            providers: [TestHandlerWithTransformer, TestTransformer],
          })
            .overrideProvider(TestTransformer)
            .useValue(transformers.success)
            .compile();

          handler = module.get(TestHandlerWithTransformer);
        });

        it('should call stepHandler with transformer', async () => {
          expect.hasAssertions();

          const performSpy = jest.spyOn(transformers.success, 'perform');

          await handler.handle(fixtures.payload);

          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, undefined);
          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, transformers.success);

          expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
        });
      });

      describe('#fail', () => {
        describe('#validation', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithTransformer, TestTransformer],
            })
              .overrideProvider(TestTransformer)
              .useValue(transformers.fail.validation)
              .compile();

            handler = module.get(TestHandlerWithTransformer);
          });

          it('should not move forward', async () => {
            expect.hasAssertions();

            const validateSpy = jest.spyOn(transformers.fail.validation, 'validate');
            const performSpy = jest.spyOn(transformers.fail.validation, 'perform');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(
              HandleStepValidationError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(
              fixtures.payload,
              transformers.fail.validation,
            );
            expect(handleStepSpy).toHaveBeenCalledTimes(2);

            expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(performSpy).not.toHaveBeenCalled();
          });
        });

        describe('#unhandled', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithTransformer, TestTransformer],
            })
              .overrideProvider(TestTransformer)
              .useValue(transformers.fail.unHandled)
              .compile();

            handler = module.get(TestHandlerWithTransformer);
          });

          it('should not move forward', async () => {
            expect.hasAssertions();

            const performSpy = jest.spyOn(transformers.fail.unHandled, 'perform');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(HandleStepRuntimeError);

            expect(handleStepSpy).toHaveBeenCalledWith(
              fixtures.payload,
              transformers.fail.unHandled,
            );
            expect(handleStepSpy).toHaveBeenCalledTimes(2);
            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          });
        });
      });
    });
  });
});
