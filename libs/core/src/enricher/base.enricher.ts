export interface BaseEnricher {
  enrich(payload: {}): Promise<{}>
}
