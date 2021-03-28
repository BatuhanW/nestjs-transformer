import { HttpService, Injectable } from '@nestjs/common';
import { BaseEnricher, ValidationResult } from '@core';
import { EnrichedTestData, TestDataResult } from '../interfaces';

@Injectable()
export class UserEnricher extends BaseEnricher<TestDataResult, EnrichedTestData> {
  constructor(private readonly httpClient: HttpService) {
    super();
  }

  validate(_payload: TestDataResult): ValidationResult {
    return {
      success: true,
    };
  }

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

  onSuccess(payload: TestDataResult): void {
    console.log(`[${this.constructor.name}] enriched payload`, { ...payload }, '\n');
  }
}
