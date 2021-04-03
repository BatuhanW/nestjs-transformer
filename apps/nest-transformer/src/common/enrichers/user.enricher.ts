import { HttpService, Injectable } from '@nestjs/common';
import { BaseEnricher, ValidationResult } from '@core';
import { EnrichedTestData, TestDataResult } from '../../interfaces';

@Injectable()
export class UserEnricher extends BaseEnricher<TestDataResult, EnrichedTestData> {
  constructor(private readonly httpClient: HttpService) {
    super();
  }

  async validate(_payload: TestDataResult): Promise<ValidationResult> {
    return {
      success: false,
      message: 'Oh sheat',
    };
  }

  async perform(payload: TestDataResult): Promise<EnrichedTestData> {
    const { data } = await this.httpClient
      .get('https://jsonplaceholder.typicode.com/users/1')
      .toPromise();

    return {
      ...payload,
      enrichment: data,
    };
  }

  async onSuccess(payload: TestDataResult): Promise<void> {
    console.log(`[${this.constructor.name}] enriched payload`, { ...payload }, '\n');
  }
}
