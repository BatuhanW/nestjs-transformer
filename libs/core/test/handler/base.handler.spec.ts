import { Test } from '@nestjs/testing';

import { TestDestination, TestTransformer, TestEnricher } from '../assets';
import { transformers, enrichers, fixtures, destinations } from '../fixtures';
import {
  EmptyTestHandler,
  TestHandlerWithDestination,
  TestHandlerWithEnricher,
  TestHandlerWithOnStart,
  TestHandlerWithOnSuccess,
  TestHandlerWithSkipFalse,
  TestHandlerWithSkipTrue,
  TestHandlerWithTransformer,
  TestHandlerWithTransformerDestination,
} from '../assets/test.handler';
import {
  BaseHandler,
  DestinationRuntimeError,
  HandleStepRuntimeError,
  HandleStepValidationError,
} from '@core';

describe('baseHandler', () => {
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
        expect.hasAssertions();

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
        expect.hasAssertions();

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

      it('should call onSuccess', async () => {
        expect.hasAssertions();

        const handlerOnSuccessSpy = jest.spyOn(TestHandlerWithOnSuccess.prototype, 'onSuccess');

        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(handlerOnSuccessSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#skip', () => {
    describe('when true', () => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [TestHandlerWithSkipTrue],
        }).compile();

        handler = module.get(TestHandlerWithSkipTrue);
      });

      it('should skip', async () => {
        expect.hasAssertions();

        await expect(handler.handle(fixtures.payload)).resolves.toBeUndefined();
      });
    });
    describe('when false', () => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [TestHandlerWithSkipFalse],
        }).compile();

        handler = module.get(TestHandlerWithSkipFalse);
      });

      it('should skip', async () => {
        expect.hasAssertions();

        await expect(handler.handle(fixtures.payload)).resolves.toEqual(fixtures.payload);
      });
    });
  });

  describe('#step-handler', () => {
    let handleStepSpy;

    beforeEach(() => {
      handleStepSpy = jest.spyOn(BaseHandler, 'handleStep');
    });

    describe('#with-hooks', () => {
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

          const validateSpy = jest.spyOn(transformers.success, 'validate');
          const performSpy = jest.spyOn(transformers.success, 'perform');
          const onSuccessSpy = jest.spyOn(transformers.success, 'onSuccess');

          await expect(handler.handle(fixtures.payload)).resolves.toStrictEqual(
            fixtures.transformed,
          );

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
            expect.hasAssertions();

            const validateSpy = jest.spyOn(transformers.fail.validation, 'validate');
            const performSpy = jest.spyOn(transformers.fail.validation, 'perform');
            const onSuccessSpy = jest.spyOn(transformers.fail.validation, 'onSuccess');
            const onErrorSpy = jest.spyOn(transformers.fail.validation, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(
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
            expect.hasAssertions();

            const validateSpy = jest.spyOn(transformers.fail.unHandled, 'validate');
            const performSpy = jest.spyOn(transformers.fail.unHandled, 'perform');
            const onSuccessSpy = jest.spyOn(transformers.fail.unHandled, 'onSuccess');
            const onErrorSpy = jest.spyOn(transformers.fail.unHandled, 'onError');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(HandleStepRuntimeError);

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

    describe('#without-hooks', () => {
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

          const performSpy = jest.spyOn(enrichers.success, 'perform');

          await handler.handle(fixtures.payload);

          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, undefined);
          expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.success);

          expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
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

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(
              HandleStepValidationError,
            );

            expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.fail.validation);
            expect(handleStepSpy).toHaveBeenCalledTimes(2);

            expect(validateSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(performSpy).not.toHaveBeenCalled();
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

            const performSpy = jest.spyOn(enrichers.fail.unHandled, 'perform');

            await expect(handler.handle(fixtures.payload)).rejects.toThrow(HandleStepRuntimeError);

            expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, enrichers.fail.unHandled);
            expect(handleStepSpy).toHaveBeenCalledTimes(2);
            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          });
        });
      });
    });
  });

  describe('#actions', () => {
    describe('#with-destination-only', () => {
      describe('#with-hooks', () => {
        describe('#success', () => {
          describe('#with-perform-result', () => {
            beforeEach(async () => {
              const module = await Test.createTestingModule({
                providers: [TestHandlerWithDestination, TestDestination],
              })
                .overrideProvider(TestDestination)
                .useValue(destinations.withHooks.success.withPerformResult)
                .compile();

              handler = module.get(TestHandlerWithDestination);
            });

            it('should not fail', async () => {
              expect.hasAssertions();

              const performSpy = jest.spyOn(
                destinations.withHooks.success.withPerformResult,
                'perform',
              );
              const onSuccessSpy = jest.spyOn(
                destinations.withHooks.success.withPerformResult,
                'onSuccess',
              );

              await expect(
                handler.handleAction(fixtures.payload, 'action'),
              ).resolves.toBeUndefined();

              expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
              expect(onSuccessSpy).toHaveBeenCalledWith(fixtures.payload);
            });
          });

          describe('#without-perform-result', () => {
            beforeEach(async () => {
              const module = await Test.createTestingModule({
                providers: [TestHandlerWithDestination, TestDestination],
              })
                .overrideProvider(TestDestination)
                .useValue(destinations.withHooks.success.withoutPerformResult)
                .compile();

              handler = module.get(TestHandlerWithDestination);
            });

            it('should not fail', async () => {
              expect.hasAssertions();

              const performSpy = jest.spyOn(
                destinations.withHooks.success.withoutPerformResult,
                'perform',
              );
              const onSuccessSpy = jest.spyOn(
                destinations.withHooks.success.withoutPerformResult,
                'onSuccess',
              );

              await expect(
                handler.handleAction(fixtures.payload, 'action'),
              ).resolves.toBeUndefined();

              expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
              expect(onSuccessSpy).toHaveBeenCalledWith(undefined);
            });
          });
        });

        describe('#fail', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithDestination, TestDestination],
            })
              .overrideProvider(TestDestination)
              .useValue(destinations.withHooks.fail)
              .compile();

            handler = module.get(TestHandlerWithDestination);
          });

          it('should fail', async () => {
            expect.hasAssertions();

            const performSpy = jest.spyOn(destinations.withHooks.fail, 'perform');
            const onSuccessSpy = jest.spyOn(destinations.withHooks.fail, 'onSuccess');
            const onErrorSpy = jest.spyOn(destinations.withHooks.fail, 'onError');

            await expect(handler.handleAction(fixtures.payload, 'action')).rejects.toThrow(
              DestinationRuntimeError,
            );

            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
            expect(onSuccessSpy).toHaveBeenCalledTimes(0);
            expect(onErrorSpy).toHaveBeenCalledWith(
              new Error("Cannot read property 'destinationFail' of undefined"),
            );
          });
        });
      });

      describe('#without-hooks', () => {
        describe('#success', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithDestination, TestDestination],
            })
              .overrideProvider(TestDestination)
              .useValue(destinations.withoutHooks.success)
              .compile();

            handler = module.get(TestHandlerWithDestination);
          });

          it('should not fail', async () => {
            expect.hasAssertions();

            const performSpy = jest.spyOn(destinations.withoutHooks.success, 'perform');

            await expect(handler.handleAction(fixtures.payload, 'action')).resolves.toBeUndefined();

            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          });
        });

        describe('#fail', () => {
          beforeEach(async () => {
            const module = await Test.createTestingModule({
              providers: [TestHandlerWithDestination, TestDestination],
            })
              .overrideProvider(TestDestination)
              .useValue(destinations.withoutHooks.fail)
              .compile();

            handler = module.get(TestHandlerWithDestination);
          });

          it('should fail', async () => {
            expect.hasAssertions();

            const performSpy = jest.spyOn(destinations.withoutHooks.fail, 'perform');

            await expect(handler.handleAction(fixtures.payload, 'action')).rejects.toThrow(
              DestinationRuntimeError,
            );

            expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          });
        });
      });
    });

    describe('#with-destination-and-transformer', () => {
      beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [TestHandlerWithTransformerDestination, TestTransformer, TestDestination],
        })
          .overrideProvider(TestTransformer)
          .useValue(transformers.success)
          .overrideProvider(TestDestination)
          .useValue(destinations.withoutHooks.success)
          .compile();

        handler = module.get(TestHandlerWithTransformerDestination);
      });

      it('should invoke StepHandler with transformer', async () => {
        expect.hasAssertions();

        const handleStepSpy = jest.spyOn(BaseHandler, 'handleStep');
        const performSpy = jest.spyOn(destinations.withoutHooks.success, 'perform');

        await expect(handler.handleAction(fixtures.payload, 'action')).resolves.toBeUndefined();

        expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, transformers.success);
        expect(performSpy).toHaveBeenCalledWith(fixtures.transformed);
      });
    });
  });
});
