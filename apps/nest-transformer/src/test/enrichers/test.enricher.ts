import { BaseEnricher } from '@core/enricher/base.enricher';
import { HttpService } from '@nestjs/common';
import { EnrichedTestData, TestDataResult } from '../interfaces';

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
