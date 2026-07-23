import type { CraftDiscoveryDetailResponse } from './craft-response.type';

/**
 * Service-internal structural input type for DiscoveryDetail before sources parsing.
 * Accepts unknown sources (e.g. raw JSON) while requiring all other public Detail fields.
 */
export type CraftDiscoveryDetailInput = Omit<
  CraftDiscoveryDetailResponse,
  'sources'
> & {
  sources: unknown;
};

/**
 * Service-internal result type from the DISCOVERY transaction execution.
 */
export interface CraftDiscoveryTransactionResult {
  isNewDiscovery: boolean;
}
