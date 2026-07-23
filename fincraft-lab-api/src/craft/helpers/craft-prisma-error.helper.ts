import { Prisma } from '../../database/generated/prisma/client';

/**
 * Custom error thrown specifically when a UserElement.create operation
 * encounters an expected composite unique constraint race condition.
 */
export class ExpectedUserElementRaceError extends Error {
  constructor() {
    super('Expected UserElement unique constraint race condition');
    this.name = 'ExpectedUserElementRaceError';
  }
}

/**
 * Safely inspects a Prisma error to determine if it represents a P2002
 * unique constraint violation on the UserElement (userId + elementId) compound key.
 *
 * Rules:
 * 1. Must be an instance of Prisma.PrismaClientKnownRequestError.
 * 2. Error code must equal 'P2002'.
 * 3. Inspects error.meta?.target safely without type assertions ('as').
 * 4. Missing or unsupported meta.target returns false (never retries every P2002).
 */
export function isUserElementUniqueConflict(error: unknown): boolean {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== 'P2002'
  ) {
    return false;
  }

  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return (
      (target.includes('user_id') && target.includes('element_id')) ||
      (target.includes('userId') && target.includes('elementId')) ||
      target.includes('user_elements_user_id_element_id_key')
    );
  }

  if (typeof target === 'string') {
    return (
      target.includes('user_elements') ||
      (target.includes('user_id') && target.includes('element_id'))
    );
  }

  return false;
}
