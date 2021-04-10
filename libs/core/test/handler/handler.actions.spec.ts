import { BaseHandler, DestinationRuntimeError } from '@core';
import { Test } from '@nestjs/testing';
import {
  TestHandlerWithDestination,
  TestHandlerWithTransformerDestination,
} from '../assets/test.handler';
import { TestDestination, TestTransformer } from '../assets';
import { destinations, fixtures, transformers } from '../fixtures';

describe('#handler', () => {
  let handler: BaseHandler;

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
