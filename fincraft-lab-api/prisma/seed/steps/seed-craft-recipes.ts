import { calculateCraftInputHash } from '../../../src/common/craft/calculate-craft-input-hash';
import { PrismaClient } from '../../../src/database/generated/prisma/client';
import { CORE_CRAFT_RECIPE_SEED_DATA } from '../content/core-craft-recipes';
import {
  EXPECTED_CORE_CRAFT_RECIPE_COUNT,
  EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT,
} from '../seed-manifest';

export interface SeedCraftRecipesResult {
  recipeCount: number;
  recipeInputCount: number;
}

export async function seedCraftRecipes(
  prisma: PrismaClient,
): Promise<SeedCraftRecipesResult> {
  // Step 1: Preflight Conflict Check on DB state
  const existingRecipes = await prisma.craftRecipe.findMany({
    include: { inputs: true },
  });

  const existingRecipeCount = existingRecipes.length;
  const existingInputCount = existingRecipes.reduce(
    (sum: number, r: { inputs: unknown[] }) => sum + r.inputs.length,
    0,
  );

  if (existingRecipeCount !== 0 || existingInputCount !== 0) {
    if (
      existingRecipeCount !== EXPECTED_CORE_CRAFT_RECIPE_COUNT ||
      existingInputCount !== EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT
    ) {
      throw new Error(
        `Preflight conflict: invalid initial recipe database state (Recipes: ${existingRecipeCount}, Inputs: ${existingInputCount}). Expected EMPTY (0/0) or COMPLETE (${EXPECTED_CORE_CRAFT_RECIPE_COUNT}/${EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT}).`,
      );
    }
  }

  // Step 2: Query Element map (slug -> Element)
  const allElements = await prisma.element.findMany({
    select: { id: true, slug: true },
  });

  const elementSlugToIdMap = new Map<string, string>();
  for (const el of allElements) {
    elementSlugToIdMap.set(el.slug, el.id);
  }

  // Step 3: Upsert Recipes & Recipe Inputs
  let seededRecipeCount = 0;
  let seededInputCount = 0;

  for (const recipeInput of CORE_CRAFT_RECIPE_SEED_DATA) {
    const outputElementId = elementSlugToIdMap.get(
      recipeInput.outputElementSlug,
    );
    if (!outputElementId) {
      throw new Error(
        `Failed to resolve element ID for output slug '${recipeInput.outputElementSlug}'`,
      );
    }

    const [inputSlugA, inputSlugB] = recipeInput.inputElementSlugs;
    const inputElementIdA = elementSlugToIdMap.get(inputSlugA);
    const inputElementIdB = elementSlugToIdMap.get(inputSlugB);

    if (!inputElementIdA) {
      throw new Error(
        `Failed to resolve element ID for input slug A '${inputSlugA}'`,
      );
    }
    if (!inputElementIdB) {
      throw new Error(
        `Failed to resolve element ID for input slug B '${inputSlugB}'`,
      );
    }

    // Call shared identity helper
    const { canonicalElementIds, inputHash } = calculateCraftInputHash(
      inputElementIdA,
      inputElementIdB,
    );

    // Verify output integrity if row exists
    const existingRecipe = await prisma.craftRecipe.findUnique({
      where: { inputHash },
    });

    if (existingRecipe && existingRecipe.outputElementId !== outputElementId) {
      throw new Error(
        `Conflict detected for inputHash '${inputHash}': existing output ID '${existingRecipe.outputElementId}' !== planned output ID '${outputElementId}'`,
      );
    }

    // Upsert CraftRecipe
    const upsertedRecipe = await prisma.craftRecipe.upsert({
      where: { inputHash },
      create: {
        outputElementId,
        inputHash,
        ruleType: recipeInput.ruleType,
        status: recipeInput.status,
      },
      update: {
        ruleType: recipeInput.ruleType,
        status: recipeInput.status,
      },
    });

    seededRecipeCount++;

    // Upsert CraftRecipeInputs (inputOrder 1 and 2 in canonical ID order)
    for (let i = 0; i < canonicalElementIds.length; i++) {
      const canonicalId = canonicalElementIds[i];
      const inputOrder = i + 1;

      const existingInput = await prisma.craftRecipeInput.findUnique({
        where: {
          recipeId_inputOrder: {
            recipeId: upsertedRecipe.id,
            inputOrder,
          },
        },
      });

      if (existingInput && existingInput.elementId !== canonicalId) {
        throw new Error(
          `Conflict detected for recipe '${upsertedRecipe.id}' inputOrder ${inputOrder}: existing element ID '${existingInput.elementId}' !== canonical element ID '${canonicalId}'`,
        );
      }

      await prisma.craftRecipeInput.upsert({
        where: {
          recipeId_inputOrder: {
            recipeId: upsertedRecipe.id,
            inputOrder,
          },
        },
        create: {
          recipeId: upsertedRecipe.id,
          elementId: canonicalId,
          inputOrder,
        },
        update: {},
      });

      seededInputCount++;
    }
  }

  return {
    recipeCount: seededRecipeCount,
    recipeInputCount: seededInputCount,
  };
}
