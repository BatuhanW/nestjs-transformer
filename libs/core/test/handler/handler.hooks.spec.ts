import { Test } from '@nestjs/testing';
import {
  EmptyTestHandler,
  TestHandlerWithOnStart,
  TestHandlerWithOnSuccess,
  TestHandlerWithSkipFalse,
  TestHandlerWithSkipTrue,
} from '../assets/test.handler';
import { fixtures } from '../fixtures';
import { Type } from '@nestjs/common';

const setupHandler = async <Handler>(handler: Type<Handler>): Promise<Handler> => {
  const module = await Test.createTestingModule({
    providers: [handler],
  }).compile();

  return module.get(handler);
};

describe('#handler', () => {
  describe('#hooks', () => {
    describe('when no hook is provided', () => {
      it('should not fail', async () => {
        expect.hasAssertions();

        const handler = await setupHandler(EmptyTestHandler);

        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();
      });
    });

    describe('when onStart provided', () => {
      it('should call onStart', async () => {
        expect.hasAssertions();

        const handler = await setupHandler(TestHandlerWithOnStart);

        const handlerOnStartSpy = jest.spyOn(TestHandlerWithOnStart.prototype, 'onStart');

        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
        expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when onSuccess provided', () => {
      it('should call onSuccess', async () => {
        expect.hasAssertions();

        const handler = await setupHandler(TestHandlerWithOnSuccess);

        const handlerOnSuccessSpy = jest.spyOn(TestHandlerWithOnSuccess.prototype, 'onSuccess');

        await expect(handler.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(handlerOnSuccessSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#skip', () => {
    describe('when true', () => {
      it('should skip', async () => {
        expect.hasAssertions();

        const handler = await setupHandler(TestHandlerWithSkipTrue);

        await expect(handler.handle(fixtures.payload)).resolves.toBeUndefined();
      });
    });

    describe('when false', () => {
      it('should skip', async () => {
        expect.hasAssertions();

        const handler = await setupHandler(TestHandlerWithSkipFalse);

        await expect(handler.handle(fixtures.payload)).resolves.toStrictEqual(fixtures.payload);
      });
    });
  });
});
