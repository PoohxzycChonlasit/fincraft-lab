import {
  ContentStatus,
  CraftRuleType,
} from '../../src/database/generated/prisma/client';
import { CraftRecipeSeedInput } from './content/core-craft-recipes';
import { ElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CORE_CRAFT_RECIPE_COUNT,
  EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT,
  EXPECTED_DISCOVERY_ELEMENT_COUNT,
} from './seed-manifest';

export function validateCraftRecipeSeed(
  recipes: CraftRecipeSeedInput[],
  starterElements: ElementSeedInput[],
  discoveryElements: ElementSeedInput[],
): void {
  if (!recipes || !Array.isArray(recipes)) {
    throw new Error('Craft recipe seed data must be an array');
  }

  if (recipes.length !== EXPECTED_CORE_CRAFT_RECIPE_COUNT) {
    throw new Error(
      `Expected exactly ${EXPECTED_CORE_CRAFT_RECIPE_COUNT} craft recipes, received ${recipes.length}`,
    );
  }

  const starterSlugs = new Set(starterElements.map((s) => s.slug));
  const discoverySlugs = new Set(discoveryElements.map((d) => d.slug));
  const allElementSlugs = new Set([...starterSlugs, ...discoverySlugs]);

  const seenRecipeOrders = new Set<number>();
  const seenOutputs = new Set<string>();
  const seenUnorderedPairs = new Set<string>();
  let totalInputReferences = 0;

  for (const recipe of recipes) {
    totalInputReferences += recipe.inputElementSlugs.length;

    // 1. Order checks
    if (
      recipe.recipeOrder < 1 ||
      recipe.recipeOrder > EXPECTED_CORE_CRAFT_RECIPE_COUNT
    ) {
      throw new Error(
        `Invalid recipeOrder '${recipe.recipeOrder}': must be between 1 and ${EXPECTED_CORE_CRAFT_RECIPE_COUNT}`,
      );
    }
    if (seenRecipeOrders.has(recipe.recipeOrder)) {
      throw new Error(`Duplicate recipeOrder '${recipe.recipeOrder}' found`);
    }
    seenRecipeOrders.add(recipe.recipeOrder);

    // 2. Exactly two inputs
    if (
      !Array.isArray(recipe.inputElementSlugs) ||
      recipe.inputElementSlugs.length !== 2
    ) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} must have exactly two input element slugs`,
      );
    }

    const [inputA, inputB] = recipe.inputElementSlugs;

    // 3. Known input slugs
    if (!allElementSlugs.has(inputA)) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} references unknown input A slug '${inputA}'`,
      );
    }
    if (!allElementSlugs.has(inputB)) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} references unknown input B slug '${inputB}'`,
      );
    }

    // 4. Distinct inputs
    if (inputA === inputB) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} has non-distinct inputs: '${inputA}' === '${inputB}'`,
      );
    }

    // 5. Output slug checks
    if (!discoverySlugs.has(recipe.outputElementSlug)) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} target output '${recipe.outputElementSlug}' is not a valid Discovery Element`,
      );
    }
    if (starterSlugs.has(recipe.outputElementSlug)) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} cannot target Starter Element '${recipe.outputElementSlug}'`,
      );
    }
    if (seenOutputs.has(recipe.outputElementSlug)) {
      throw new Error(
        `Duplicate recipe target output '${recipe.outputElementSlug}' found`,
      );
    }
    seenOutputs.add(recipe.outputElementSlug);

    // 6. No output self-reference
    if (
      recipe.outputElementSlug === inputA ||
      recipe.outputElementSlug === inputB
    ) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} output '${recipe.outputElementSlug}' is used as its own input`,
      );
    }

    // 7. Duplicate unordered pair check
    const sortedPairKey = [inputA, inputB].sort().join(' + ');
    if (seenUnorderedPairs.has(sortedPairKey)) {
      throw new Error(
        `Duplicate unordered input pair '${sortedPairKey}' found in recipe order ${recipe.recipeOrder}`,
      );
    }
    seenUnorderedPairs.add(sortedPairKey);

    // 8. Enum checks
    if (recipe.ruleType !== CraftRuleType.COMMUTATIVE) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} ruleType must be COMMUTATIVE`,
      );
    }
    if (recipe.status !== ContentStatus.ACTIVE) {
      throw new Error(
        `Recipe order ${recipe.recipeOrder} status must be ACTIVE`,
      );
    }
  }

  if (totalInputReferences !== EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT} total input references, counted ${totalInputReferences}`,
    );
  }

  if (seenOutputs.size !== EXPECTED_DISCOVERY_ELEMENT_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_DISCOVERY_ELEMENT_COUNT} unique discovery outputs, found ${seenOutputs.size}`,
    );
  }

  // 9. Progression Graph Reachability & Depth Analysis
  validateRecipeProgressionGraph(recipes, starterSlugs);
}

function validateRecipeProgressionGraph(
  recipes: CraftRecipeSeedInput[],
  starterSlugs: Set<string>,
): void {
  const unlocked = new Set<string>(starterSlugs);
  const elementDepth = new Map<string, number>();
  for (const s of starterSlugs) elementDepth.set(s, 0);

  let depthCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let remaining = [...recipes];
  let depth = 1;
  let progress = true;

  while (remaining.length > 0 && progress) {
    progress = false;
    const nextRemaining: CraftRecipeSeedInput[] = [];
    const newlyUnlockedThisRound = new Set<string>();

    for (const r of remaining) {
      const [inA, inB] = r.inputElementSlugs;
      if (unlocked.has(inA) && unlocked.has(inB)) {
        newlyUnlockedThisRound.add(r.outputElementSlug);
        elementDepth.set(r.outputElementSlug, depth);
        depthCounts[depth] = (depthCounts[depth] || 0) + 1;
        progress = true;
      } else {
        nextRemaining.push(r);
      }
    }

    for (const item of newlyUnlockedThisRound) unlocked.add(item);
    remaining = nextRemaining;
    depth++;
  }

  if (remaining.length > 0) {
    const stuck = remaining.map((r) => r.outputElementSlug).join(', ');
    throw new Error(
      `Unreachable recipe outputs found in progression graph: ${stuck}`,
    );
  }

  if (
    depthCounts[1] !== 13 ||
    depthCounts[2] !== 7 ||
    depthCounts[3] !== 1 ||
    depthCounts[4] !== 1
  ) {
    throw new Error(
      `Progression depth distribution mismatch: expected {1:13, 2:7, 3:1, 4:1}, got ${JSON.stringify(depthCounts)}`,
    );
  }
}
