import { Test } from '@nestjs/testing';
import {
  EmptyTestMuavin,
  TestMuavinWithOnStart,
  TestMuavinWithOnSuccess,
  TestMuavinWithSkipFalse,
  TestMuavinWithSkipTrue,
} from '../assets/test.muavin';
import { fixtures } from '../fixtures';
import { Type } from '@nestjs/common';

const setupMuavin = async <Muavin>(muavin: Type<Muavin>): Promise<Muavin> => {
  const module = await Test.createTestingModule({
    providers: [muavin],
  }).compile();

  return module.get(muavin);
};

describe('#muavin', () => {
  describe('#hooks', () => {
    describe('when no hook is provided', () => {
      it('should not fail', async () => {
        expect.hasAssertions();

        const muavin = await setupMuavin(EmptyTestMuavin);

        await expect(muavin.handle(fixtures.payload)).resolves.toBeTruthy();
      });
    });

    describe('when onStart provided', () => {
      it('should call onStart', async () => {
        expect.hasAssertions();

        const muavin = await setupMuavin(TestMuavinWithOnStart);

        const muavinOnStartSpy = jest.spyOn(TestMuavinWithOnStart.prototype, 'onStart');

        await expect(muavin.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(muavinOnStartSpy).toHaveBeenCalledWith(fixtures.payload);
        expect(muavinOnStartSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when onSuccess provided', () => {
      it('should call onSuccess', async () => {
        expect.hasAssertions();

        const muavin = await setupMuavin(TestMuavinWithOnSuccess);

        const muavinOnSuccessSpy = jest.spyOn(TestMuavinWithOnSuccess.prototype, 'onSuccess');

        await expect(muavin.handle(fixtures.payload)).resolves.toBeTruthy();

        expect(muavinOnSuccessSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#skip', () => {
    describe('when true', () => {
      it('should skip', async () => {
        expect.hasAssertions();

        const muavin = await setupMuavin(TestMuavinWithSkipTrue);

        await expect(muavin.handle(fixtures.payload)).resolves.toBeUndefined();
      });
    });

    describe('when false', () => {
      it('should skip', async () => {
        expect.hasAssertions();

        const muavin = await setupMuavin(TestMuavinWithSkipFalse);

        await expect(muavin.handle(fixtures.payload)).resolves.toStrictEqual(fixtures.payload);
      });
    });
  });
});
