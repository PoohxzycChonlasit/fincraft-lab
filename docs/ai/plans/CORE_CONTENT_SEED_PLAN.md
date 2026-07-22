# CORE_CONTENT_SEED_PLAN.md — FinCraft Lab Submission Seed v1 Implementation Plan

## 1. Purpose and Scope

This document is the canonical specification and technical plan for **FinCraft Lab Submission Seed v1**.

The purpose of Seed v1 is to provide a complete, playable, financially accurate, and maintainable starting dataset for FinCraft Lab. Seed v1 populates core educational content (Categories, Elements, Discovery Details, Craft Recipes, Element Relationships, and Simulations) directly through a structured, idempotent NestJS/Prisma seed script without requiring manual data entry via Postman or database tools.

## 2. Current Schema Compatibility

The seed plan strictly complies with the approved 15-model MVP Prisma schema (`prisma/schema.prisma`):

| Model | Schema Compatibility & Field Mapping |
|---|---|
| `ElementCategory` | `id` (UUID), `name` (unique), `description`, `sortOrder`, `status` (`ACTIVE`) |
| `Element` | `id` (UUID), `categoryId`, `name`, `slug` (unique), `emoji`, `elementType` (`ElementType` enum), `isStarter` (boolean), `status` (`APPROVED`) |
| `DiscoveryDetail` | `id` (UUID), `elementId` (unique), `shortDescription`, `realLesson`, `example`, `possibleBenefit`, `possibleTradeoff`, `hiddenRisk`, `worksWhen`, `becomesDifficultWhen`, `whatChangesOutcome`, `realityLevel` (`RealityLevel` enum), `safetyLabel` (`SafetyLabel` enum), `sources` (JSON array) |
| `CraftRecipe` | `id` (UUID), `outputElementId`, `inputHash` (unique SHA-256 hash of sorted input element UUIDs), `ruleType` (`COMMUTATIVE`), `status` (`APPROVED`) |
| `CraftRecipeInput` | `id` (UUID), `recipeId`, `elementId`, `inputOrder` (1, 2), unique `[recipeId, inputOrder]` |
| `ElementRelationship` | `id` (UUID), `sourceElementId`, `targetElementId`, `relationshipType`, `label`, `description`, `strength` (`RelationshipStrength` enum), `sources` (JSON array), `status` (`ACTIVE`) |
| `Simulation` | `id` (UUID), `linkedElementId` (optional), `name`, `description`, `simulationType` (unique string key), `status` (`ACTIVE`) |

## 3. Explicit Non-Goals

- **No Schema Expansion**: No changes to `prisma/schema.prisma` or new migrations.
- **No Core User Activity Seed**: Core Seed creates zero `User`, `Pet`, `UserElement`, `DiscoveryEvent`, `Workspace`, `WorkspaceNode`, `WorkspaceEdge`, or `SimulationRun` records.
- **No Financial Advice**: No stock picks, market predictions, buy/sell calls, or moral judgments.
- **No Automatic DB Reset**: Seed script will never invoke `prisma migrate reset` or destructive `deleteMany`.
- **No Unsafe Credentials**: No hardcoded production passwords or credentials in Git.

## 4. Final Target Counts

| Entity | Target Count |
|---|---|
| Element Categories | **8** |
| Starter Elements | **14** (globally available) |
| Discovery Elements | **22** (unlocked via Craft) |
| **Total Elements** | **36** |
| Discovery Details | **36** (1:1 with Elements) |
| Craft Recipes | **48** |
| Craft Recipe Inputs | **96** (2 inputs per recipe) |
| Element Relationships | **24** |
| Simulations | **2** |

### Recipe Distribution Target

- **Starter + Starter Recipes**: 24 recipes (Tier 1 discoveries)
- **Starter + Discovery Recipes**: 18 recipes (Tier 2 discoveries)
- **Discovery + Discovery Recipes**: 6 recipes (Tier 3 discoveries)
- **Total Recipes**: 48 recipes

---

## 5. Category Catalog (8 Categories)

| # | Name | Description | Sort Order | Status |
|---|---|---|---|---|
| 1 | Money Flow | Core concepts of cash inflows, outflows, and net income tracking. | 1 | ACTIVE |
| 2 | Saving & Financial Safety | Building emergency buffers, liquidity, and capital preservation. | 2 | ACTIVE |
| 3 | Debt & Credit | Understanding borrowing costs, credit mechanisms, and debt pressure. | 3 | ACTIVE |
| 4 | Cost of Living | Managing fixed and variable living expenses, inflation, and essentials. | 4 | ACTIVE |
| 5 | Financial Behavior | Psychological spending drivers, impulse control, and decision biases. | 5 | ACTIVE |
| 6 | Life Events & Risk | Unplanned financial shocks, job loss, emergency events, and risk mitigation. | 6 | ACTIVE |
| 7 | Planning Tools | Budgeting frameworks, financial tracking, and decision-making tools. | 7 | ACTIVE |
| 8 | Digital Financial Safety | Online financial hygiene, fraud prevention, and digital security. | 8 | ACTIVE |

---

## 6. Complete 36-Element Catalog

### Starter Elements (14 Elements)

| # | Slug | Name | Category | ElementType | Emoji | Short Educational Purpose |
|---|---|---|---|---|---|---|
| 1 | `income` | Earned Income | Money Flow | BASE | 💵 | Regular cash influx from employment or business activities. |
| 2 | `expense` | General Expense | Cost of Living | BASE | 💳 | Everyday cash outflows required for living activities. |
| 3 | `saving` | Basic Savings | Saving & Safety | BASE | 🏦 | Setting aside cash reserves for short-term future use. |
| 4 | `debt` | Borrowed Debt | Debt & Credit | BASE | 📝 | Money borrowed that must be repaid over time. |
| 5 | `interest` | Interest Rate | Debt & Credit | TOOL | 📈 | The cost of borrowing money or the reward for saving it. |
| 6 | `inflation` | Market Inflation | Cost of Living | RISK | 🎈 | The gradual decrease of purchasing power over time. |
| 7 | `emergency-fund` | Emergency Fund | Saving & Safety | TOOL | 🛡️ | Liquid cash buffer designated strictly for unexpected shocks. |
| 8 | `food` | Food & Groceries | Cost of Living | BASE | 🍲 | Essential baseline nourishment and daily meal expenses. |
| 9 | `rent` | Shelter Rent | Cost of Living | BASE | 🏠 | Monthly contractual payment for housing shelter. |
| 10 | `budget` | Budget Plan | Planning Tools | TOOL | 📊 | An intentional allocation plan for income against expenses. |
| 11 | `needs` | Essential Needs | Cost of Living | CONCEPT | 🧱 | Non-negotiable baseline requirements for survival and stability. |
| 12 | `wants` | Discretionary Wants | Financial Behavior | CONCEPT | 🎁 | Non-essential desires that improve comfort or entertainment. |
| 13 | `fomo` | Social Pressure / FOMO | Financial Behavior | RISK | 📱 | Fear of missing out driving impulsive financial behavior. |
| 14 | `job-loss` | Unexpected Job Loss | Life Events & Risk | RISK | ⚡ | Sudden interruption of primary earned income. |

### Discovery Elements (22 Elements)

| # | Slug | Name | Category | ElementType | Emoji | Discovery Tier |
|---|---|---|---|---|---|---|
| 15 | `cash-flow` | Net Cash Flow | Money Flow | CONCEPT | 🔄 | Tier 1 |
| 16 | `debt-pressure` | Debt Service Burden | Debt & Credit | RISK | ⚖️ | Tier 1 |
| 17 | `cost-pressure` | Living Inflation Pressure | Cost of Living | RISK | 📈 | Tier 1 |
| 18 | `emergency-resilience` | Financial Safety Buffer | Life Events & Risk | CONCEPT | 🏰 | Tier 1 |
| 19 | `impulse-spending` | Unplanned Impulse Purchase | Financial Behavior | BEHAVIOR | 🛍️ | Tier 1 |
| 20 | `spending-plan` | Structured Spending Plan | Planning Tools | TOOL | 📐 | Tier 1 |
| 21 | `savings-growth` | Compounded Savings Growth | Saving & Safety | CONCEPT | 🌱 | Tier 1 |
| 22 | `debt-trap` | Compound Interest Debt Trap | Debt & Credit | RISK | 🪤 | Tier 1 |
| 23 | `purchasing-power-loss` | Real Purchasing Power Erosion | Cost of Living | RISK | 📉 | Tier 1 |
| 24 | `lifestyle-creep` | Lifestyle Inflation Creep | Financial Behavior | BEHAVIOR | 🏎️ | Tier 1 |
| 25 | `emergency-liquidity` | Immediate Liquid Cushion | Saving & Safety | TOOL | 💧 | Tier 1 |
| 26 | `debt-payoff-strategy` | Debt Acceleration Strategy | Planning Tools | TOOL | 🎯 | Tier 1 |
| 27 | `essential-baseline` | Fixed Baseline Expenses | Cost of Living | CONCEPT | ⚓ | Tier 1 |
| 28 | `discretionary-leakage` | Stealth Cash Leakage | Financial Behavior | RISK | 💸 | Tier 1 |
| 29 | `digital-scam-risk` | Digital Fraud Vulnerability | Digital Safety | RISK | 🎣 | Tier 1 |
| 30 | `financial-stability` | Financial Resilience State | Saving & Safety | DISCOVERY | 🏆 | Tier 2 |
| 31 | `debt-overload` | Severe Debt Overload | Debt & Credit | RISK | 💥 | Tier 2 |
| 32 | `emergency-survival` | Shock Survival Capability | Life Events & Risk | DISCOVERY | 🧗 | Tier 2 |
| 33 | `mindful-spending` | Mindful Consumption Behavior | Financial Behavior | BEHAVIOR | 🧘 | Tier 2 |
| 34 | `budget-optimizing` | Dynamic Allocation Strategy | Planning Tools | TOOL | ⚡ | Tier 2 |
| 35 | `digital-hygiene` | Digital Security Shield | Digital Safety | TOOL | 🔒 | Tier 2 |
| 36 | `financial-freedom-foundation` | Financial Independence Core | Planning Tools | DISCOVERY | 🌟 | Tier 3 |

---

## 7. Starter versus Discovery Classification

- **14 Starter Elements (`isStarter: true`)**: Automatically available to all users in Craft canvas.
- **22 Discovery Elements (`isStarter: false`)**: Unlocked dynamically when a user successfully crafts a matching recipe.

---

## 8. Complete 48-Craft Recipe Matrix

All recipes use `ruleType: COMMUTATIVE` (input element order does not alter outcome).

### Tier 1 Recipes (24 Starter + Starter)

| # | Input 1 Slug | Input 2 Slug | Output Element Slug | Output Name |
|---|---|---|---|---|
| 1 | `income` | `expense` | `cash-flow` | Net Cash Flow |
| 2 | `debt` | `interest` | `debt-pressure` | Debt Service Burden |
| 3 | `inflation` | `food` | `cost-pressure` | Living Inflation Pressure |
| 4 | `emergency-fund` | `job-loss` | `emergency-resilience` | Financial Safety Buffer |
| 5 | `wants` | `fomo` | `impulse-spending` | Unplanned Impulse Purchase |
| 6 | `budget` | `expense` | `spending-plan` | Structured Spending Plan |
| 7 | `saving` | `interest` | `savings-growth` | Compounded Savings Growth |
| 8 | `debt` | `fomo` | `debt-trap` | Compound Interest Debt Trap |
| 9 | `inflation` | `rent` | `purchasing-power-loss` | Real Purchasing Power Erosion |
| 10 | `income` | `wants` | `lifestyle-creep` | Lifestyle Inflation Creep |
| 11 | `saving` | `emergency-fund` | `emergency-liquidity` | Immediate Liquid Cushion |
| 12 | `budget` | `debt` | `debt-payoff-strategy` | Debt Acceleration Strategy |
| 13 | `needs` | `rent` | `essential-baseline` | Fixed Baseline Expenses |
| 14 | `expense` | `fomo` | `discretionary-leakage` | Stealth Cash Leakage |
| 15 | `income` | `fomo` | `digital-scam-risk` | Digital Fraud Vulnerability |
| 16 | `income` | `saving` | `savings-growth` | Compounded Savings Growth (Alt) |
| 17 | `expense` | `food` | `essential-baseline` | Fixed Baseline Expenses (Alt) |
| 18 | `debt` | `job-loss` | `debt-overload` | Severe Debt Overload |
| 19 | `budget` | `income` | `spending-plan` | Structured Spending Plan (Alt) |
| 20 | `saving` | `job-loss` | `emergency-survival` | Shock Survival Capability |
| 21 | `needs` | `food` | `essential-baseline` | Fixed Baseline Expenses (Alt 2) |
| 22 | `wants` | `budget` | `mindful-spending` | Mindful Consumption Behavior |
| 23 | `fomo` | `job-loss` | `digital-scam-risk` | Digital Fraud Vulnerability (Alt) |
| 24 | `emergency-fund` | `needs` | `emergency-resilience` | Financial Safety Buffer (Alt) |

### Tier 2 Recipes (18 Starter + Discovery)

| # | Input 1 Slug | Input 2 Slug | Output Element Slug | Output Name |
|---|---|---|---|---|
| 25 | `cash-flow` | `saving` | `financial-stability` | Financial Resilience State |
| 26 | `debt-pressure` | `interest` | `debt-trap` | Compound Interest Debt Trap (Alt) |
| 27 | `emergency-resilience` | `saving` | `financial-stability` | Financial Resilience State (Alt) |
| 28 | `impulse-spending` | `budget` | `mindful-spending` | Mindful Consumption Behavior (Alt) |
| 29 | `spending-plan` | `income` | `budget-optimizing` | Dynamic Allocation Strategy |
| 30 | `essential-baseline` | `income` | `cash-flow` | Net Cash Flow (Alt) |
| 31 | `debt-pressure` | `job-loss` | `debt-overload` | Severe Debt Overload (Alt) |
| 32 | `digital-scam-risk` | `budget` | `digital-hygiene` | Digital Security Shield |
| 33 | `cash-flow` | `budget` | `budget-optimizing` | Dynamic Allocation Strategy (Alt) |
| 34 | `lifestyle-creep` | `budget` | `mindful-spending` | Mindful Consumption Behavior (Alt 2) |
| 35 | `discretionary-leakage` | `budget` | `mindful-spending` | Mindful Consumption Behavior (Alt 3) |
| 36 | `cost-pressure` | `budget` | `essential-baseline` | Fixed Baseline Expenses (Alt 3) |
| 37 | `emergency-liquidity` | `job-loss` | `emergency-survival` | Shock Survival Capability (Alt) |
| 38 | `debt-payoff-strategy` | `income` | `financial-stability` | Financial Resilience State (Alt 2) |
| 39 | `purchasing-power-loss` | `saving` | `savings-growth` | Compounded Savings Growth (Alt 2) |
| 40 | `digital-scam-risk` | `needs` | `digital-hygiene` | Digital Security Shield (Alt) |
| 41 | `emergency-resilience` | `income` | `financial-stability` | Financial Resilience State (Alt 3) |
| 42 | `cash-flow` | `emergency-fund` | `financial-stability` | Financial Resilience State (Alt 4) |

### Tier 3 Recipes (6 Discovery + Discovery)

| # | Input 1 Slug | Input 2 Slug | Output Element Slug | Output Name |
|---|---|---|---|---|
| 43 | `financial-stability` | `budget-optimizing` | `financial-freedom-foundation` | Financial Independence Core |
| 44 | `emergency-survival` | `financial-stability` | `financial-freedom-foundation` | Financial Independence Core (Alt) |
| 45 | `mindful-spending` | `financial-stability` | `financial-freedom-foundation` | Financial Independence Core (Alt 2) |
| 46 | `digital-hygiene` | `financial-stability` | `financial-freedom-foundation` | Financial Independence Core (Alt 3) |
| 47 | `debt-overload` | `debt-payoff-strategy` | `cash-flow` | Net Cash Flow (Recovery Path) |
| 48 | `debt-trap` | `spending-plan` | `debt-payoff-strategy` | Debt Acceleration Strategy (Recovery Path) |

---

## 9. Discovery Detail Content Outline (36 Details)

Every Element has a corresponding 1:1 `DiscoveryDetail` record mapped directly to existing schema fields:

- `shortDescription`: 1-sentence quick summary.
- `realLesson`: Core financial literacy insight.
- `example`: Concrete real-world scenario.
- `possibleBenefit`: Key positive outcome when managed well.
- `possibleTradeoff`: Associated cost or sacrificed opportunity.
- `hiddenRisk`: Non-obvious vulnerability or trap.
- `worksWhen`: Ideal conditions under which this concept operates effectively.
- `becomesDifficultWhen`: Conditions that stress or break this financial concept.
- `whatChangesOutcome`: Critical variables altering results.
- `realityLevel`: Enum (`STORY`, `SIMPLIFIED_MODEL`, `NEAR_REALITY`).
- `safetyLabel`: Enum (`EDUCATION_ONLY`, `SIMULATION_ONLY`, `HIGH_RISK_CONCEPT`).
- `sources`: JSON array of source references `[{ title, organization, url }]`.

---

## 10. Element Relationship Matrix (24 Relationships)

| # | Source Slug | Target Slug | Relationship Type | Label | Strength |
|---|---|---|---|---|---|
| 1 | `income` | `cash-flow` | PRODUCES | Positive Cash Inflow | STRONG |
| 2 | `expense` | `cash-flow` | REDUCES | Cash Outflow Impact | STRONG |
| 3 | `saving` | `emergency-fund` | BUILDS | Safety Foundation | STRONG |
| 4 | `debt` | `interest` | GENERATES | Debt Cost Generator | STRONG |
| 5 | `interest` | `debt-trap` | ACCELERATES | Compounding Cost Risk | STRONG |
| 6 | `inflation` | `purchasing-power-loss` | ERODES | Real Value Erosion | STRONG |
| 7 | `emergency-fund` | `emergency-resilience` | PROVIDES | Shock Absorber | STRONG |
| 8 | `fomo` | `impulse-spending` | TRIGGERS | Psychological Buying Impulse | MODERATE |
| 9 | `budget` | `spending-plan` | ENABLES | Structured Planning | STRONG |
| 10 | `income` | `lifestyle-creep` | EXPANDS | Expenditure Inflation Risk | MODERATE |
| 11 | `expense` | `discretionary-leakage` | DRIVES | Unnoticed Cash Drain | MODERATE |
| 12 | `job-loss` | `debt-overload` | AMPLIFIES | Financial Crisis Trigger | STRONG |
| 13 | `debt-payoff-strategy` | `debt-pressure` | MITIGATES | Debt Burden Reduction | STRONG |
| 14 | `mindful-spending` | `discretionary-leakage` | CONTROLS | Leakage Suppression | MODERATE |
| 15 | `digital-hygiene` | `digital-scam-risk` | PROTECTS | Fraud Mitigation Shield | STRONG |
| 16 | `financial-stability` | `financial-freedom-foundation` | LEADS_TO | Long-term Freedom Core | WEAK |
| 17 | `needs` | `essential-baseline` | FORMS | Baseline Cost Floor | STRONG |
| 18 | `wants` | `impulse-spending` | INFLUENCES | Discretionary Demand | MODERATE |
| 19 | `savings-growth` | `financial-stability` | SUPPORTS | Wealth Cushioning | MODERATE |
| 20 | `cost-pressure` | `cash-flow` | SQUEEZES | Margin Compression | MODERATE |
| 21 | `emergency-liquidity` | `emergency-survival` | SUSTAINS | Survival Runway | STRONG |
| 22 | `budget-optimizing` | `financial-freedom-foundation` | ACCELERATES | Efficiency Multiplier | WEAK |
| 23 | `debt-trap` | `debt-overload` | ESCALATES | Insolvency Escalation | STRONG |
| 24 | `emergency-resilience` | `job-loss` | BUFFERS | Shock Mitigation | STRONG |

---

## 11. Two Simulation Definitions

### Simulation 1: Cash Flow Projection (`simulationType: "CASH_FLOW_PROJECTION"`)

- **Linked Element**: `cash-flow`
- **Name**: Monthly Cash Flow & Net Margin Projection
- **Description**: Projects monthly net cash margin across variable income and living expense scenarios.
- **Input Parameters (JSON)**: `monthlyIncome` (number, > 0), `fixedExpenses` (number, >= 0), `variableExpenses` (number, >= 0).
- **Output Parameters (JSON)**: `netCashFlow` (income - fixed - variable), `savingsRatePercent` ((netCashFlow / monthlyIncome) * 100), `marginStatus` ("SURPLUS" | "BALANCED" | "DEFICIT").
- **Formula**: `netCashFlow = monthlyIncome - (fixedExpenses + variableExpenses)`.
- **Assumptions & Safety**: Constant monthly income assumption; **SIMULATION_ONLY**.

### Simulation 2: Emergency Fund Coverage (`simulationType: "EMERGENCY_FUND_COVERAGE"`)

- **Linked Element**: `emergency-fund`
- **Name**: Emergency Fund Survival Runway Calculator
- **Description**: Calculates survival months provided by liquid cash reserves against essential baseline expenses.
- **Input Parameters (JSON)**: `liquidReserves` (number, >= 0), `monthlyEssentialExpenses` (number, > 0).
- **Output Parameters (JSON)**: `runwayMonths` (liquidReserves / monthlyEssentialExpenses), `safetyRating` ("CRITICAL" | "MINIMAL" | "ADEQUATE" | "OPTIMAL").
- **Formula**: `runwayMonths = liquidReserves / monthlyEssentialExpenses`.
- **Assumptions & Safety**: Zero income during shock period; **SIMULATION_ONLY**.

---

## 12. Seed Architecture

Teacher-aligned modular structure:

```text
prisma/
├── seed.ts                     <-- Small entry runner
└── seed/
    ├── seed-manifest.ts        <-- Expected counts and validation constants
    ├── seed-utils.ts           <-- Canonical input hash calculation & helpers
    ├── verify-seed.ts          <-- Post-seed DB verification reporter
    ├── content/
    │   ├── categories.ts       <-- 8 Categories
    │   ├── elements/           <-- 36 Elements (split by domain)
    │   │   ├── money-flow.ts
    │   │   ├── saving-safety.ts
    │   │   ├── debt-credit.ts
    │   │   ├── cost-of-living.ts
    │   │   ├── financial-behavior.ts
    │   │   ├── life-events-risk.ts
    │   │   ├── planning-tools.ts
    │   │   └── digital-safety.ts
    │   ├── discovery-details.ts<-- 36 Discovery Details
    │   ├── recipes/            <-- 48 Recipes (tiered)
    │   │   ├── tier-one.ts
    │   │   ├── tier-two.ts
    │   │   └── tier-three.ts
    │   ├── relationships.ts    <-- 24 Relationships
    │   └── simulations.ts      <-- 2 Simulations
    └── steps/
        ├── seed-categories.ts
        ├── seed-elements.ts
        ├── seed-discovery-details.ts
        ├── seed-recipes.ts
        ├── seed-relationships.ts
        └── seed-simulations.ts
```

---

## 13. Stable-Key and Idempotency Design

To ensure seed scripts are 100% idempotent (can be run repeatedly without duplicating or corrupting data):

1. **Unique Business Keys**:
   - `ElementCategory.name`
   - `Element.slug`
   - `DiscoveryDetail.elementId`
   - `CraftRecipe.inputHash` (SHA-256 of sorted input UUIDs)
   - `Simulation.simulationType`
2. **Canonical Input Hash (`inputHash`)**:
   - For commutative recipes with inputs `A` and `B`, sort UUIDs lexicographically: `sortedIds = [idA, idB].sort()`.
   - Calculate `inputHash = sha256(sortedIds.join(':'))`.
   - Guaranteed order-independent identity: `Craft(A, B) == Craft(B, A)`.
3. **Upsert Pattern**:
   - Every step uses `prisma.<model>.upsert()` matching on the unique natural key.

---

## 14. Write Order and Transaction Boundaries

Seed writes execute in strict dependency order inside a single Prisma `$transaction`:

```text
1. Seed Categories (ElementCategory)
   │
   ▼
2. Seed Elements (Element)
   │
   ▼
3. Seed Discovery Details (DiscoveryDetail)
   │
   ▼
4. Seed Craft Recipes & Recipe Inputs (CraftRecipe + CraftRecipeInput)
   │
   ▼
5. Seed Element Relationships (ElementRelationship)
   │
   ▼
6. Seed Simulations (Simulation)
```

If any step fails, the entire transaction rolls back automatically.

---

## 15. Core versus Demo Profile Policy

- **Core Seed**: Only content records (`ElementCategory`, `Element`, `DiscoveryDetail`, `CraftRecipe`, `CraftRecipeInput`, `ElementRelationship`, `Simulation`). Zero user data.
- **Demo Profile (Optional, local-only)**: Evaluated only when explicitly enabled by local environment flag. Creates no user data in core seed.

---

## 16. Pre-Write Validation

Before any database write, the seed runner performs in-memory validation:

1. Category references exist for all 36 elements.
2. Slugs are unique and match `^[a-z0-9-]+$`.
3. Exactly 14 elements marked `isStarter: true`.
4. Exactly 36 Discovery Details exist (1:1 with Elements).
5. All 48 recipes reference existing elements.
6. All 48 `inputHash` values are unique.
7. Every Starter Element appears in >= 3 recipes.
8. All 24 relationships reference existing source and target elements.
9. Simulation types are valid.

If any check fails, the runner throws a `ValidationError` and halts before touching the database.

---

## 17. Post-Seed Verification Report

Upon completion, `verify-seed.ts` queries PostgreSQL and prints the report:

```text
Categories:                       8
Elements:                        36 (14 Starter, 22 Discovery)
Discovery Details:               36
Craft Recipes:                   48
Craft Recipe Inputs:             96
Element Relationships:           24
Simulations:                      2

Duplicate Slugs:                  0
Duplicate Recipe Hashes:          0
Missing Category References:      0
Missing Discovery Details:        0
Starter Elements Under-covered:   0
Unexpected User Rows:             0
```

---

## 18. Source and Financial Safety Policy

- All content carries `safetyLabel: EDUCATION_ONLY` or `SIMULATION_ONLY`.
- Educational lessons represent simplified models, not investment advice.
- Source references cite recognized organizations (e.g., Bank of Thailand, Thai SEC, OECD, World Bank).

---

## 19. Known Schema Limitations & Mapping

- **Recipe Inputs**: Schema supports N-input recipes via `CraftRecipeInput`. Seed v1 focuses on 2-input recipes (`inputOrder: 1, 2`).
- **Simulation Calculations**: `Simulation` model stores metadata. Execution logic lives in backend simulation service.

---

## 20. Future Implementation Sequence

```text
P5_SEED_1_PLAN_CORE_CONTENT_001 (This plan - COMPLETE)
  │
  ▼
P5_SEED_2_IMPLEMENT_INFRASTRUCTURE_001 (Seed runner, utils, pre-write validator framework)
  │
  ▼
P5_SEED_3_SEED_CORE_CONTENT_001 (Populate content datasets and run seed)
  │
  ▼
P6_READ_1_ELEMENT_CATEGORY_READ_APIS_001 (GET /element-categories)
```

---

## 21. Acceptance Criteria

1. Plan defines 8 Categories, 36 Elements (14 Starter, 22 Discovery), 36 Discovery Details, 48 Recipes, 96 Recipe Inputs, 24 Relationships, and 2 Simulations.
2. Plan enforces 100% schema compatibility without schema changes.
3. Every Starter Element appears in >= 3 recipes.
4. Idempotency and SHA-256 `inputHash` logic defined.
5. Zero application code or database data modified in this plan step.

---

## 22. Risks and Mitigations

- **Risk**: Input hash mismatch between seed and runtime craft engine.
  - **Mitigation**: Shared `calculateInputHash()` utility used in both seed and backend `CraftService`.
- **Risk**: Invalid foreign key references during seed.
  - **Mitigation**: In-memory pre-write validation halts execution before database writes.
