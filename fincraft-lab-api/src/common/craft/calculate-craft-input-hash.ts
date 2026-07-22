import { createHash } from 'node:crypto';

export interface CraftInputHashResult {
  canonicalElementIds: [string, string];
  inputHash: string;
}

/**
 * Calculates a deterministic, commutative input hash for a two-element craft recipe.
 *
 * Rules:
 * 1. Accepts exactly two non-blank Element IDs.
 * 2. Rejects duplicate Element IDs (distinct inputs required).
 * 3. Lexicographically sorts Element IDs to ensure order independence: Craft(A, B) === Craft(B, A).
 * 4. Serializes the canonical tuple with JSON.stringify and hashes with SHA-256.
 * 5. Returns canonical Element IDs and lowercase 64-character hex string inputHash.
 */
export function calculateCraftInputHash(
  elementIdA: string,
  elementIdB: string,
): CraftInputHashResult {
  if (typeof elementIdA !== 'string' || typeof elementIdB !== 'string') {
    throw new Error('Craft input element IDs must be non-empty strings');
  }

  const idA = elementIdA.trim();
  const idB = elementIdB.trim();

  if (!idA) {
    throw new Error('First craft input element ID cannot be blank');
  }

  if (!idB) {
    throw new Error('Second craft input element ID cannot be blank');
  }

  if (idA === idB) {
    throw new Error(
      `Distinct input elements required: received duplicate ID '${idA}'`,
    );
  }

  const canonicalElementIds: [string, string] = [idA, idB].sort() as [
    string,
    string,
  ];
  const serialized = JSON.stringify(canonicalElementIds);
  const inputHash = createHash('sha256').update(serialized).digest('hex');

  return {
    canonicalElementIds,
    inputHash,
  };
}
