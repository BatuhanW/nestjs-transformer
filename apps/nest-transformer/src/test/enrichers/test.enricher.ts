import { HttpService, Injectable } from '@nestjs/common';
import { Enricher, BaseEnricher } from '@core';
import { EnrichedTestData, TestDataResult } from '../interfaces';

@Injectable()
@Enricher({ handlers: ['TestHandler', 'Test2Handler'] })
export class TestEnricher
  implements BaseEnricher<TestDataResult, Promise<EnrichedTestData>> {
  constructor(private readonly httpClient: HttpService) {}

  async perform(payload: TestDataResult): Promise<EnrichedTestData> {
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
