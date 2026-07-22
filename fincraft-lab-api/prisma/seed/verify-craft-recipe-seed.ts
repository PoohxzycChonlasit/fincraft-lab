import { calculateCraftInputHash } from '../../src/common/craft/calculate-craft-input-hash';
import { PrismaClient } from '../../src/database/generated/prisma/client';
import {
  EXPECTED_CORE_CRAFT_RECIPE_COUNT,
  EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT,
  EXPECTED_DISCOVERY_ELEMENT_COUNT,
} from './seed-manifest';

export interface VerifyCraftRecipeSeedResult {
  recipeCount: number;
  recipeInputCount: number;
  uniqueOutputCount: number;
  isIdempotentAndValid: boolean;
}

export async function verifyCraftRecipeSeed(
  prisma: PrismaClient,
): Promise<VerifyCraftRecipeSeedResult> {
  const recipes = await prisma.craftRecipe.findMany({
    include: {
      outputElement: { select: { id: true, slug: true, isStarter: true } },
      inputs: {
        include: { element: { select: { id: true, slug: true } } },
        orderBy: { inputOrder: 'asc' },
      },
    },
  });

  if (recipes.length !== EXPECTED_CORE_CRAFT_RECIPE_COUNT) {
    throw new Error(
      `Database CraftRecipe count mismatch: expected ${EXPECTED_CORE_CRAFT_RECIPE_COUNT}, found ${recipes.length}`,
    );
  }

  let totalInputs = 0;
  const seenOutputIds = new Set<string>();
  const seenInputHashes = new Set<string>();

  for (const recipe of recipes) {
    totalInputs += recipe.inputs.length;

    // 1. Output checks
    if (recipe.outputElement.isStarter) {
      throw new Error(
        `Database CraftRecipe '${recipe.id}' produces Starter Element '${recipe.outputElement.slug}'`,
      );
    }

    if (seenOutputIds.has(recipe.outputElementId)) {
      throw new Error(
        `Duplicate database output Element ID '${recipe.outputElementId}' found`,
      );
    }
    seenOutputIds.add(recipe.outputElementId);

    // 2. Hash uniqueness
    if (seenInputHashes.has(recipe.inputHash)) {
      throw new Error(
        `Duplicate database recipe inputHash '${recipe.inputHash}' found`,
      );
    }
    seenInputHashes.add(recipe.inputHash);

    // 3. Inputs count and order
    if (recipe.inputs.length !== 2) {
      throw new Error(
        `Database CraftRecipe '${recipe.id}' has ${recipe.inputs.length} inputs, expected exactly 2`,
      );
    }

    const input1 = recipe.inputs[0];
    const input2 = recipe.inputs[1];

    if (input1.inputOrder !== 1 || input2.inputOrder !== 2) {
      throw new Error(
        `Database CraftRecipe '${recipe.id}' inputOrder set is invalid: expected {1, 2}, got {${input1.inputOrder}, ${input2.inputOrder}}`,
      );
    }

    // 4. Distinct input elements
    if (input1.elementId === input2.elementId) {
      throw new Error(
        `Database CraftRecipe '${recipe.id}' has duplicate input element ID '${input1.elementId}'`,
      );
    }

    // 5. Canonical ordering check
    if (input1.elementId > input2.elementId) {
      throw new Error(
        `Database CraftRecipe '${recipe.id}' inputs are not in canonical ID order: '${input1.elementId}' > '${input2.elementId}'`,
      );
    }

    // 6. SHA-256 Hash Verification against shared helper
    const { inputHash: expectedHash } = calculateCraftInputHash(
      input1.elementId,
      input2.elementId,
    );

    if (recipe.inputHash !== expectedHash) {
      throw new Error(
        `Database CraftRecipe '${recipe.id}' inputHash mismatch: stored '${recipe.inputHash}' !== calculated '${expectedHash}'`,
      );
    }
  }

  if (totalInputs !== EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT) {
    throw new Error(
      `Database CraftRecipeInput count mismatch: expected ${EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT}, found ${totalInputs}`,
    );
  }

  if (seenOutputIds.size !== EXPECTED_DISCOVERY_ELEMENT_COUNT) {
    throw new Error(
      `Database unique output count mismatch: expected ${EXPECTED_DISCOVERY_ELEMENT_COUNT}, found ${seenOutputIds.size}`,
    );
  }

  return {
    recipeCount: recipes.length,
    recipeInputCount: totalInputs,
    uniqueOutputCount: seenOutputIds.size,
    isIdempotentAndValid: true,
  };
}
