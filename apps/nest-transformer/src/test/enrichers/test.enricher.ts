import { BaseEnricher } from '@core/enricher/base.enricher';
import { HttpService, Injectable } from '@nestjs/common';
import { Enricher } from '@core/decorators/enricher.decorator';
import { EnrichedTestData, TestDataResult } from '../interfaces';

@Injectable()
@Enricher({ handler: 'TestHandler' })
export class TestEnricher implements BaseEnricher {
  constructor(private readonly httpClient: HttpService) {}

  async enrich(payload: TestDataResult): Promise<EnrichedTestData> {
    const { data } = await this.httpClient
      .get('https://jsonplaceholder.typicode.com/todos/1', {
        params: { name: payload.data.test },
      })
      .toPromise();

    return {
      data: {
        ...payload.data,
        ...data,
      },
    };
  }
}
