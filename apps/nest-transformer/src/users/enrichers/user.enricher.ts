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
      success: false,
      message: 'Enricher failed',
    };
  }

  async perform(payload: TestDataResult): Promise<EnrichedTestData> {
    console.log('Im triggered for some reason', payload);
    const { data } = await this.httpClient
      .post('https://apiqa.getgrover.com.com/api/v1/oauth/tokens')
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
