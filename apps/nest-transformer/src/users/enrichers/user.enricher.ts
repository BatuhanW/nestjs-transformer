import { HttpService, Injectable } from '@nestjs/common';
import { BaseEnricher } from '@core';
import { EnrichedTestData, TestDataResult } from '../interfaces';

@Injectable()
export class UserEnricher implements BaseEnricher<TestDataResult, Promise<EnrichedTestData>> {
  constructor(private readonly httpClient: HttpService) {}

  async perform(payload: TestDataResult): Promise<EnrichedTestData> {
    const { data } = await this.httpClient
      .get('https://jsonplaceholder.typicode.com/users/1')
      .toPromise();

    return {
      data: {
        ...payload.data,
        ...data,
      },
    };
  }
}
