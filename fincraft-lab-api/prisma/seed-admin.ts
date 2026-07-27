/**
 * Local development Super Admin bootstrap script.
 *
 * Usage:
 *   FINCRAFT_ADMIN_EMAIL=... FINCRAFT_ADMIN_PASSWORD=... pnpm run seed:admin
 *
 * Required environment variables:
 *   FINCRAFT_ADMIN_EMAIL        — must be a valid email address
 *   FINCRAFT_ADMIN_PASSWORD     — must be 8–72 characters
 *
 * Optional environment variables:
 *   FINCRAFT_ADMIN_DISPLAY_NAME — display name (default: "Super Admin")
 *   DATABASE_URL                — PostgreSQL connection string
 *
 * This script is idempotent: running it again on the same email
 * promotes the account and updates the password hash without
 * duplicating the row.
 *
 * Never commits credentials. Never prints password or hash.
 */
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { createSeedPrismaClient } from './seed/seed-client';
import {
  UserRole,
  UserStatus,
} from '../src/database/generated/prisma/client';

const BCRYPT_SALT_ROUNDS = 12;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

function readRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Required environment variable ${key} is missing or empty.`);
  }
  return value.trim();
}

function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`FINCRAFT_ADMIN_EMAIL is not a valid email address.`);
  }
  if (email.length > 254) {
    throw new Error(`FINCRAFT_ADMIN_EMAIL must be at most 254 characters.`);
  }
}

function validatePassword(password: string): void {
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    throw new Error(
      `FINCRAFT_ADMIN_PASSWORD must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`,
    );
  }
}

async function main(): Promise<void> {
  console.log('--- FinCraft Lab Super Admin Bootstrap ---');

  const rawEmail = readRequiredEnv('FINCRAFT_ADMIN_EMAIL');
  const rawPassword = readRequiredEnv('FINCRAFT_ADMIN_PASSWORD');
  const displayName = (process.env['FINCRAFT_ADMIN_DISPLAY_NAME'] ?? '').trim() || 'Super Admin';

  const email = rawEmail.toLowerCase();
  validateEmail(email);
  validatePassword(rawPassword);

  console.log(`Target email  : ${email}`);
  console.log(`Display name  : ${displayName}`);
  console.log('Hashing password...');

  const passwordHash = await bcrypt.hash(rawPassword, BCRYPT_SALT_ROUNDS);

  const prisma = createSeedPrismaClient();

  try {
    const result = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        displayName,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      },
      create: {
        email,
        passwordHash,
        displayName,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('Bootstrap complete:');
    console.log(`  id          : ${result.id}`);
    console.log(`  email       : ${result.email}`);
    console.log(`  displayName : ${result.displayName}`);
    console.log(`  role        : ${result.role}`);
    console.log(`  status      : ${result.status}`);
    console.log(`  updatedAt   : ${result.updatedAt.toISOString()}`);
    console.log('--- Bootstrap finished successfully ---');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  console.error('BOOTSTRAP_FATAL_ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
