import { Test } from '@nestjs/testing';

import { BaseDestination, Muavin, DestinationRuntimeError } from '@core';

import {
  TestMuavinWithDestination,
  TestMuavinWithTransformerDestination,
  TestDestination,
  TestTransformer,
} from '../assets';
import { destinations, fixtures, transformers } from '../fixtures';

const setupMuavin = async (overrideValue: BaseDestination) => {
  const module = await Test.createTestingModule({
    providers: [TestMuavinWithDestination, TestDestination],
  })
    .overrideProvider(TestDestination)
    .useValue(overrideValue)
    .compile();

  return module.get(TestMuavinWithDestination);
};

describe('#muavin', () => {
  describe('#actions', () => {
    describe('#with-destination-hooks', () => {
      describe('#success', () => {
        it('should trigger destination onSuccess hook', async () => {
          expect.hasAssertions();

          const muavin = await setupMuavin(destinations.withHooks.success.withoutPerformResult);

          const performSpy = jest.spyOn(
            destinations.withHooks.success.withoutPerformResult,
            'perform',
          );
          const onSuccessSpy = jest.spyOn(
            destinations.withHooks.success.withoutPerformResult,
            'onSuccess',
          );

          await expect(muavin.handleAction(fixtures.payload, 'action')).resolves.toBeUndefined();

          expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
          expect(onSuccessSpy).toHaveBeenCalledWith(undefined);
        });
      });

      describe('#fail', () => {
        it('should trigger destination onError hook', async () => {
          expect.hasAssertions();

          const muavin = await setupMuavin(destinations.withHooks.fail);

          const performSpy = jest.spyOn(destinations.withHooks.fail, 'perform');
          const onSuccessSpy = jest.spyOn(destinations.withHooks.fail, 'onSuccess');
          const onErrorSpy = jest.spyOn(destinations.withHooks.fail, 'onError');

          await expect(muavin.handleAction(fixtures.payload, 'action')).rejects.toThrow(
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
      describe('#fail', () => {
        it('should fail successfully', async () => {
          expect.hasAssertions();

          const muavin = await setupMuavin(destinations.withoutHooks.fail);

          const performSpy = jest.spyOn(destinations.withoutHooks.fail, 'perform');

          await expect(muavin.handleAction(fixtures.payload, 'action')).rejects.toThrow(
            DestinationRuntimeError,
          );

          expect(performSpy).toHaveBeenCalledWith(fixtures.payload);
        });
      });
    });
  });

  describe('#with-transformer', () => {
    it('should invoke StepMuavin with transformer', async () => {
      expect.hasAssertions();

      const module = await Test.createTestingModule({
        providers: [TestMuavinWithTransformerDestination, TestTransformer, TestDestination],
      })
        .overrideProvider(TestTransformer)
        .useValue(transformers.success)
        .overrideProvider(TestDestination)
        .useValue(destinations.withoutHooks.success)
        .compile();

      const muavin = module.get(TestMuavinWithTransformerDestination);

      const handleStepSpy = jest.spyOn(Muavin, 'handleStep');
      const performSpy = jest.spyOn(destinations.withoutHooks.success, 'perform');

      await expect(muavin.handleAction(fixtures.payload, 'action')).resolves.toBeUndefined();

      expect(handleStepSpy).toHaveBeenCalledWith(fixtures.payload, transformers.success);
      expect(performSpy).toHaveBeenCalledWith(fixtures.plainTransformed);
    });
  });
});
