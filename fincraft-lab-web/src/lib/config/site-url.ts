const LOCAL_DEVELOPMENT_URL = "http://localhost:3000";

function withProtocol(value: string): string {
  return /^https?:\/\//u.test(value) ? value : `https://${value}`;
}

export function getSiteUrl(): URL {
  const configuredUrl = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const deploymentUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const candidate = configuredUrl ?? deploymentUrl;

  if (!candidate) {
    return new URL(LOCAL_DEVELOPMENT_URL);
  }

  return new URL(withProtocol(candidate));
}
