import { BaseEnricher } from '@core/enricher/base.enricher';
import { HttpService, Injectable } from '@nestjs/common';
import { Enricher } from '@core/decorators/enricher.decorator';
import { EnrichedTestData, TestDataResult } from '../interfaces';

@Injectable()
@Enricher({ handler: 'TestHandler' })
@Enricher({ handler: 'Test2Handler' })
export class TestEnricher implements BaseEnricher {
  constructor(private readonly httpClient: HttpService) {}

  async enrich(payload: TestDataResult): Promise<EnrichedTestData> {
    const { data } = await this.httpClient
      .get('https://api.agify.io', {
        params: { name: payload.data.test },
      })
      .toPromise();

    return {
      data: {
        ...payload,
        ...data,
      },
    };
  }
}
