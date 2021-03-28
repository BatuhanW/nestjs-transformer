import { Test, TestingModule } from '@nestjs/testing';
import { TestHandler } from '../assets/test.handler';
import { TestDestination } from '../assets/test.destination';

import { happyTransformer, happyEnricher, fixtures, happyDestination } from '../fixtures';
import { TestTransformer } from '../assets/test.transformer';
import { TestEnricher } from '../assets/test.enricher';

describe('BaseHandler', () => {
  let handler: TestHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestTransformer, TestEnricher, TestDestination, TestHandler],
    })
      .overrideProvider(TestTransformer)
      .useValue(happyTransformer)
      .overrideProvider(TestEnricher)
      .useValue(happyEnricher)
      .overrideProvider(TestDestination)
      .useValue(happyDestination)
      .compile();

    handler = module.get<TestHandler>(TestHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('Test Path', () => {
    it('should be happy', async () => {
      const handlerOnStartSpy = jest.spyOn(TestHandler.prototype, 'onStart');

      const tfValidateSpy = jest.spyOn(happyTransformer, 'validate');
      const tfPerformSpy = jest.spyOn(happyTransformer, 'perform');
      const tfOnSuccessSpy = jest.spyOn(happyTransformer, 'onSuccess');

      const enValidateSpy = jest.spyOn(happyEnricher, 'validate');
      const enPerformSpy = jest.spyOn(happyEnricher, 'perform');
      const enOnSuccessSpy = jest.spyOn(happyEnricher, 'onSuccess');

      const destPerformSpy = jest.spyOn(happyDestination, 'perform');
      const destOnSuccessSpy = jest.spyOn(happyDestination, 'onSuccess');

      await handler.handle(fixtures.happy.payload);

      expect(handlerOnStartSpy).toHaveBeenCalledWith(fixtures.happy.payload);
      expect(handlerOnStartSpy).toHaveBeenCalledTimes(1);

      expect(tfValidateSpy).toHaveBeenCalledWith(fixtures.happy.payload);
      expect(tfValidateSpy).toHaveBeenCalledTimes(1);

      expect(tfPerformSpy).toHaveBeenCalledWith(fixtures.happy.payload);
      expect(tfPerformSpy).toHaveBeenCalledTimes(1);

      expect(tfOnSuccessSpy).toHaveBeenCalledWith(fixtures.happy.transformed);
      expect(tfOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(enValidateSpy).toHaveBeenCalledWith(fixtures.happy.transformed);
      expect(enValidateSpy).toHaveBeenCalledTimes(1);

      expect(enPerformSpy).toHaveBeenCalledWith(fixtures.happy.transformed);
      expect(enPerformSpy).toHaveBeenCalledTimes(1);

      expect(enOnSuccessSpy).toHaveBeenCalledWith(fixtures.happy.enriched);
      expect(enOnSuccessSpy).toHaveBeenCalledTimes(1);

      expect(destPerformSpy).toHaveBeenCalledWith(fixtures.happy.enriched);
      expect(destPerformSpy).toHaveBeenCalledTimes(1);

      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
      expect(destOnSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
