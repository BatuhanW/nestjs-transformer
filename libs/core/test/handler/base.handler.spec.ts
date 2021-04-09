import { Test } from '@nestjs/testing';

import { TestDestination, TestTransformer, TestEnricher } from '../assets';
import { transformers, enrichers, fixtures } from '../fixtures';
import {
  EmptyTestHandler,
  TestHandlerWithDestination,
  TestHandlerWithEnricher,
  TestHandlerWithOnStart,
  TestHandlerWithOnSuccess,
  TestHandlerWithTransformer,
} from '../assets/test.handler';
import { BaseHandler, HandleStepRuntimeError, HandleStepValidationError } from '@core';

describe('BaseHandler', () => {
  let handler: BaseHandler;

  describe('#hooks', () => {
    describe('when no hook is provided', () => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [EmptyTestHandler],
        }).compile();

        handler = module.get(EmptyTestHandler);
      });

      it('should not fail', async () => {
        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();
      });
    });

    describe('when onStart provided', () => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [TestHandlerWithOnStart],
        }).compile();

        handler = module.get(TestHandlerWithOnStart);
      });

      it('should call onStart', async () => {
        const handlerOnStartSpy = jest.spyOn(TestHandlerWithOnStart.prototype, 'onStart');

        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
        expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when onSuccess provided', () => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [TestHandlerWithOnSuccess],
        }).compile();

        handler = module.get(TestHandlerWithOnSuccess);
      });

      it('should call onStart', async () => {
        const handlerOnSuccessSpy = jest.spyOn(TestHandlerWithOnSuccess.prototype, 'onSuccess');

        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(handlerOnSuccessSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#step-handler', () => {
    let handleStepSpy;

    beforeEach(() => {
      handleStepSpy = jest.spyOn(BaseHandler, 'handleStep');
    });

    describe('#transform', () => {
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
          const validateSpy = jest.spyOn(transformers.success, 'validate');
          const performSpy = jest.spyOn(transformers.success, 'perform');
          const onSuccessSpy = jest.spyOn(transformers.success, 'onSuccess');

          await handler.handle(fixtures.payload);

          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, transformers.success);
          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.transformed, undefined);

          expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
          expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          expect(onSuccessSpy).toHaveBeenCalledTimes(1);
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
            const validateSpy = jest.spyOn(transformers.fail.validation, 'validate');
            const performSpy = jest.spyOn(transformers.fail.validation, 'perform');
            const onSuccessSpy = jest.spyOn(transformers.fail.validation, 'onSuccess');
            const onErrorSpy = jest.spyOn(transformers.fail.validation, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
              HandleStepValidationError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(
              fixtures.payload,
              transformers.fail.validation,
            );
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
              providers: [TestHandlerWithTransformer, TestTransformer],
            })
              .overrideProvider(TestTransformer)
              .useValue(transformers.fail.unHandled)
              .compile();

            handler = module.get(TestHandlerWithTransformer);
          });

          it('should not move forward', async () => {
            const validateSpy = jest.spyOn(transformers.fail.unHandled, 'validate');
            const performSpy = jest.spyOn(transformers.fail.unHandled, 'perform');
            const onSuccessSpy = jest.spyOn(transformers.fail.unHandled, 'onSuccess');
            const onErrorSpy = jest.spyOn(transformers.fail.unHandled, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
              HandleStepRuntimeError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(
              fixtures.payload,
              transformers.fail.unHandled,
            );
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

    describe('#enrich', () => {
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
          const validateSpy = jest.spyOn(enrichers.success, 'validate');
          const performSpy = jest.spyOn(enrichers.success, 'perform');
          const onSuccessSpy = jest.spyOn(enrichers.success, 'onSuccess');

          await handler.handle(fixtures.payload);

          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, undefined);
          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.success);

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
            const validateSpy = jest.spyOn(enrichers.fail.validation, 'validate');
            const performSpy = jest.spyOn(enrichers.fail.validation, 'perform');
            const onSuccessSpy = jest.spyOn(enrichers.fail.validation, 'onSuccess');
            const onErrorSpy = jest.spyOn(enrichers.fail.validation, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
              HandleStepValidationError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.fail.validation);
            expect(handleStepSpy).toHaveBeenCalledTimes(2);

            expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onErrorSpy).toHaveBeenCalledWith(
              new HandleStepValidationError('TestEnricher', fixtures.payload, 'Validation fail!'),
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
            const validateSpy = jest.spyOn(enrichers.fail.unHandled, 'validate');
            const performSpy = jest.spyOn(enrichers.fail.unHandled, 'perform');
            const onSuccessSpy = jest.spyOn(enrichers.fail.unHandled, 'onSuccess');
            const onErrorSpy = jest.spyOn(enrichers.fail.unHandled, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrowError(
              HandleStepRuntimeError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.fail.unHandled);
            expect(handleStepSpy).toHaveBeenCalledTimes(2);

            expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onErrorSpy).toHaveBeenCalledWith(
              new Error("Cannot read property 'enricherFail' of undefined"),
            );
            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onSuccessSpy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('#actions', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [TestHandlerWithDestination, TestDestination],
      }).compile();

      handler = module.get(TestHandlerWithDestination);
    });
  });
});
