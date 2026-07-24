export type EnvVariable = {
  PORT?: string;
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
};

export function validateEnv(config: Record<string, unknown>): EnvVariable {
  const databaseUrl = config.DATABASE_URL;
  if (typeof databaseUrl !== 'string' || databaseUrl.trim().length === 0) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const accessTokenSecret = config.ACCESS_TOKEN_SECRET;
  if (
    typeof accessTokenSecret !== 'string' ||
    accessTokenSecret.trim().length === 0
  ) {
    throw new Error('ACCESS_TOKEN_SECRET environment variable is required');
  }

  const accessTokenExpiresIn = config.ACCESS_TOKEN_EXPIRES_IN;
  if (
    typeof accessTokenExpiresIn !== 'string' ||
    accessTokenExpiresIn.trim().length === 0
  ) {
    throw new Error('ACCESS_TOKEN_EXPIRES_IN environment variable is required');
  }

  return {
    PORT: typeof config.PORT === 'string' ? config.PORT : undefined,
    DATABASE_URL: databaseUrl.trim(),
    ACCESS_TOKEN_SECRET: accessTokenSecret.trim(),
    ACCESS_TOKEN_EXPIRES_IN: accessTokenExpiresIn.trim(),
  };
}
