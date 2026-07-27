export interface TrustedAuthority {
  organization: string;
  host: string;
  jurisdiction: 'GLOBAL' | 'UNITED_STATES' | 'EUROPEAN_UNION';
  sourceType: string;
  tier: 'TIER_1' | 'TIER_2';
}

export const TRUSTED_AUTHORITIES: Record<string, TrustedAuthority> = {
  'oecd.org': {
    organization: 'OECD',
    host: 'oecd.org',
    jurisdiction: 'GLOBAL',
    sourceType: 'International organisation',
    tier: 'TIER_1',
  },
  'worldbank.org': {
    organization: 'World Bank',
    host: 'worldbank.org',
    jurisdiction: 'GLOBAL',
    sourceType: 'International organisation',
    tier: 'TIER_1',
  },
  'imf.org': {
    organization: 'IMF',
    host: 'imf.org',
    jurisdiction: 'GLOBAL',
    sourceType: 'International organisation',
    tier: 'TIER_1',
  },
  'bis.org': {
    organization: 'BIS',
    host: 'bis.org',
    jurisdiction: 'GLOBAL',
    sourceType: 'International organisation',
    tier: 'TIER_1',
  },
  'ecb.europa.eu': {
    organization: 'ECB',
    host: 'ecb.europa.eu',
    jurisdiction: 'EUROPEAN_UNION',
    sourceType: 'Central bank',
    tier: 'TIER_2',
  },
  'consumerfinance.gov': {
    organization: 'CFPB',
    host: 'consumerfinance.gov',
    jurisdiction: 'UNITED_STATES',
    sourceType: 'Government regulator',
    tier: 'TIER_2',
  },
  'investor.gov': {
    organization: 'Investor.gov',
    host: 'investor.gov',
    jurisdiction: 'UNITED_STATES',
    sourceType: 'Government investor education',
    tier: 'TIER_2',
  },
  'sec.gov': {
    organization: 'SEC',
    host: 'sec.gov',
    jurisdiction: 'UNITED_STATES',
    sourceType: 'Government regulator',
    tier: 'TIER_2',
  },
  'ftc.gov': {
    organization: 'FTC',
    host: 'ftc.gov',
    jurisdiction: 'UNITED_STATES',
    sourceType: 'Consumer protection agency',
    tier: 'TIER_2',
  },
};

export function findTrustedAuthority(hostname: string): TrustedAuthority | undefined {
  const normalizedHost = hostname.toLowerCase().replace(/^www\./, '');
  for (const [registeredHost, authority] of Object.entries(TRUSTED_AUTHORITIES)) {
    if (normalizedHost === registeredHost || normalizedHost.endsWith('.' + registeredHost)) {
      return authority;
    }
  }
  return undefined;
}

export function cleanCanonicalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.protocol = 'https:';
    parsed.hostname = parsed.hostname.toLowerCase();
    const searchParams = new URLSearchParams(parsed.search);
    const keysToDelete: string[] = [];
    searchParams.forEach((_, key) => {
      if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid') {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => searchParams.delete(key));
    parsed.search = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}
