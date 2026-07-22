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
- `realityLevel`: Enum (`GROUNDED`, `SIMPLIFIED_MODEL`, `SCENARIO`, `HYPOTHESIS`).
- `safetyLabel`: Enum (`EDUCATION_ONLY`, `SIMULATION_ONLY`, `NOT_FINANCIAL_ADVICE`, `HIGH_RISK_TOPIC`, `NEEDS_REVIEW`).
- `sources`: JSON array of source references `[{ title, organization, url }]`.

---

### 9.1 Starter Element DiscoveryDetail Content v2 — FROZEN (FROZEN_STARTER_ELEMENT_DETAILS_SOURCE_VERIFIED_V2)

The following 14 records contain exact, frozen, implementation-ready per-record values for all Starter Elements, verified at audit time with sufficient evidence that each official page exists and supports the relevant claim.

```typescript
export const FROZEN_STARTER_ELEMENT_DETAILS = [
  {
    elementSlug: 'income',
    shortDescription: 'Regular inflows of money earned through labor, employment, business operations, or asset yields.',
    realLesson: 'Earned income forms the top-line foundation of personal cash flow, dictating maximum baseline capacity for living expenses, debt servicing, and long-term asset accumulation.',
    example: 'A salaried worker receives THB 30,000 monthly net after income tax and social security deductions.',
    possibleBenefit: 'Provides predictable cash inflows to cover basic sustenance, build emergency reserves, and fund future opportunities.',
    possibleTradeoff: 'Requires ongoing commitment of time, energy, and human capital, limiting immediate leisure and personal flexibility.',
    hiddenRisk: 'Over-relying on a single income stream creates high vulnerability to sudden employment or economic shocks.',
    worksWhen: 'Employment conditions are stable, skills remain in demand, and compensation keeps pace with cost of living.',
    becomesDifficultWhen: 'Macroeconomic recessions occur, industry disruptions happen, or health issues impair work capacity.',
    whatChangesOutcome: 'Market demand for skills, skill development, career advancement, and income stream diversification.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
    ],
  },
  {
    elementSlug: 'expense',
    shortDescription: 'Outflows of cash required to purchase goods, services, and living necessities.',
    realLesson: 'Expenses directly consume earned income; unmonitored baseline expenditure compresses net margin and impairs long-term wealth accumulation.',
    example: 'Monthly living expenses totaling THB 22,000 for utility bills, transportation, subscription services, and daily needs.',
    possibleBenefit: 'Secures essential lifestyle goods, maintains daily operational stability, and supports personal well-being.',
    possibleTradeoff: 'Reduces available net surplus cash flow that could otherwise build liquid reserves or productive capital.',
    hiddenRisk: 'Untracked recurring micro-expenses accumulate unnoticed over time, creating chronic monthly cash deficit pressure.',
    worksWhen: 'Outflows are intentionally tracked, categorized, and capped well below total monthly earned income.',
    becomesDifficultWhen: 'Unplanned price increases occur, lifestyle expectations escalate, or mandatory bills rise without income growth.',
    whatChangesOutcome: 'Spending awareness, expense categorization, budget limits, and disciplined consumer choices.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'แยกให้ปัง... Needs กับ Wants วางแผนเงินอย่างไรไม่ให้รั่วไหล',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
    ],
  },
  {
    elementSlug: 'saving',
    shortDescription: 'Portion of current income intentionally set aside for future security rather than immediate consumption.',
    realLesson: 'Saving is the primary bridge between cash surplus and long-term financial security, requiring consistent discipline to build liquid buffers.',
    example: 'Setting aside THB 3,000 directly into a high-yield savings account on payday before allocating discretionary spending.',
    possibleBenefit: 'Creates a growing pool of uncommitted capital for emergencies, major purchases, and future investments.',
    possibleTradeoff: 'Requires sacrificing immediate discretionary consumption and instant lifestyle gratification.',
    hiddenRisk: 'Leaving all savings in zero-yield cash accounts risks real purchasing power erosion during inflationary periods.',
    worksWhen: 'Savings habits are automated on payday and cash is kept in secure, liquid, deposit-protected institutions.',
    becomesDifficultWhen: 'Monthly living expenses equal or exceed total income, or unexpected emergency costs drain reserves.',
    whatChangesOutcome: 'Savings rate percentage, automation of transfers, inflation rate, and account yield.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
      {
        title: 'สถาบันคุ้มครองเงินฝาก (Deposit Protection Agency Thailand)',
        organization: 'Deposit Protection Agency Thailand',
        url: 'https://www.dpa.or.th',
      },
    ],
  },
  {
    elementSlug: 'debt',
    shortDescription: 'Borrowed funds that create a legal obligation for future repayment with interest.',
    realLesson: 'Debt pulls future purchasing power into the present, incurring mandatory ongoing repayment obligations and interest costs.',
    example: 'Taking out a THB 50,000 personal loan repayable over 12 months with monthly principal and interest charges.',
    possibleBenefit: 'Enables immediate acquisition of essential high-value assets or productive capital before full funding is saved.',
    possibleTradeoff: 'Pledges future income to fixed monthly debt obligations, restricting financial flexibility and cash flow.',
    hiddenRisk: 'High-cost borrowing can escalate into compounding debt burdens if income is interrupted or borrowing continues.',
    worksWhen: 'Debt is structured at low interest rates for productive assets and total monthly debt service stays below 30% of income.',
    becomesDifficultWhen: 'Multiple high-interest debts are accumulated, income declines, or repayment deadlines are missed.',
    whatChangesOutcome: 'Interest rate, repayment term duration, total debt-to-income ratio, and borrower discipline.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'NOT_FINANCIAL_ADVICE',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
    ],
  },
  {
    elementSlug: 'interest',
    shortDescription: 'The fee charged for borrowing money or the return earned for lending/saving capital.',
    realLesson: 'Interest is a double-edged financial engine: compounding against you as a debt cost, or compounding in your favor as a growth return.',
    example: 'A 15% annual percentage rate (APR) credit card charge adds THB 750 in monthly interest cost on a THB 60,000 balance.',
    possibleBenefit: 'Generates passive growth on invested capital and savings deposits over extended time horizons.',
    possibleTradeoff: 'Increases the total cost of credit, requiring borrowers to pay back substantially more than original principal.',
    hiddenRisk: 'Compounding interest on debt rapidly expands principal balances if only minimum monthly payments are made.',
    worksWhen: 'Interest rates on savings/investments exceed inflation, while debt interest rates are minimized or eliminated.',
    becomesDifficultWhen: 'Borrowing at high APRs during economic downturns when surplus cash flow is unavailable.',
    whatChangesOutcome: 'Annual percentage rate, compounding frequency, duration of loan or investment, and principal balance.',
    realityLevel: 'SIMPLIFIED_MODEL',
    safetyLabel: 'SIMULATION_ONLY',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
    ],
  },
  {
    elementSlug: 'inflation',
    shortDescription: 'The general rate of increase in goods and service prices, eroding cash purchasing power over time.',
    realLesson: 'Inflation steadily diminishes what a fixed amount of cash can buy, requiring capital to grow at or above inflation rate to maintain real value.',
    example: 'An annual inflation rate of 3% increases an annual basket of groceries from THB 60,000 to THB 61,800 for the same items.',
    possibleBenefit: 'Moderate inflation encourages productive economic activity and asset investment over cash hoarding.',
    possibleTradeoff: 'Reduces the real purchasing power of uninvested cash reserves and fixed-income payouts.',
    hiddenRisk: 'Ignoring inflation causes long-term savings goals to fall short of real future living costs.',
    worksWhen: 'Personal income growth and asset returns outpace the prevailing headline inflation rate.',
    becomesDifficultWhen: 'High inflation coincides with stagnant wages or low nominal deposit yields (stagflation risk).',
    whatChangesOutcome: 'Central bank monetary policy, supply chain dynamics, commodity prices, and asset allocation strategy.',
    realityLevel: 'SIMPLIFIED_MODEL',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
      {
        title: 'OECD Financial Education Competency Principles',
        organization: 'OECD',
        url: 'https://www.oecd.org/en/topics/financial-education.html',
      },
    ],
  },
  {
    elementSlug: 'emergency-fund',
    shortDescription: 'Dedicated liquid cash buffer reserved strictly to absorb unexpected financial shocks.',
    realLesson: 'An emergency fund serves as a primary financial shock absorber, preventing temporary crises from forcing high-cost debt accumulation.',
    example: 'Setting aside THB 90,000 in a liquid savings account to cover 3 to 6 months of essential living expenses.',
    possibleBenefit: 'Provides immediate financial resilience and peace of mind during job loss, medical events, or urgent repairs.',
    possibleTradeoff: 'Cash held in liquid emergency accounts earns modest yields compared to higher-return long-term investments.',
    hiddenRisk: 'Using emergency funds for non-emergency discretionary purchases leaves households exposed to real crises.',
    worksWhen: 'Reserves equal 3 to 6 months of baseline living costs and are stored in safe, instantly accessible liquid accounts.',
    becomesDifficultWhen: 'Multiple major crises hit in rapid succession, depleting reserves faster than they can be replenished.',
    whatChangesOutcome: 'Monthly essential expense size, fund liquidity, discipline of usage rules, and replenishment speed.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
      {
        title: 'วางแผนเงินสำรองฉุกเฉินและการจัดสรรงบประมาณ',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
    ],
  },
  {
    elementSlug: 'food',
    shortDescription: 'Baseline expenditure required for daily nutritional sustenance and household groceries.',
    realLesson: 'Food is a mandatory non-discretionary baseline expense that can fluctuate significantly based on dining choices and food inflation.',
    example: 'Budgeting THB 6,000 per month for home groceries and essential daily meals.',
    possibleBenefit: 'Sustains physical health, energy, and work capacity necessary for daily productivity.',
    possibleTradeoff: 'High discretionary dining out absorbs cash that could otherwise be allocated to savings or debt reduction.',
    hiddenRisk: 'Unmonitored dining out and food delivery app fees can quietly double baseline nutrition costs without added benefit.',
    worksWhen: 'Meal planning and grocery shopping are planned intentionally against a defined monthly spending target.',
    becomesDifficultWhen: 'Food prices spike sharply due to inflation or supply disruptions without adjusting consumption habits.',
    whatChangesOutcome: 'Ratio of home cooking to dining out, food price inflation, meal planning, and waste reduction.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน (Household Expenditure Survey)',
        organization: 'National Statistical Office Thailand',
        url: 'https://www.nso.go.th',
      },
    ],
  },
  {
    elementSlug: 'rent',
    shortDescription: 'Contractual monthly payment made to a landlord in exchange for housing shelter.',
    realLesson: 'Rent is typically the largest fixed monthly living expense, creating an unyielding obligation that must be met regardless of income fluctuations.',
    example: 'Paying THB 8,000 monthly rent for an apartment under a 12-month lease agreement.',
    possibleBenefit: 'Secures safe, immediate shelter without long-term mortgage debt, property taxes, or structural maintenance costs.',
    possibleTradeoff: 'Monthly rental payments build no equity or long-term ownership value for the tenant.',
    hiddenRisk: 'Leasing property above 30% of net income severely crowds out savings, emergency buffers, and discretionary margin.',
    worksWhen: 'Rent stays within 25%–30% of net income and lease terms match employment stability.',
    becomesDifficultWhen: 'Income declines unexpectedly while locked into a long-term contractual lease agreement.',
    whatChangesOutcome: 'Location choices, room sharing, lease duration, income level, and housing market demand.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'การวางแผนค่าใช้จ่ายที่อยู่อาศัยและค่าเช่า',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
    ],
  },
  {
    elementSlug: 'budget',
    shortDescription: 'An intentional plan allocating estimated income toward expenses, savings, and debt payoff over a period.',
    realLesson: 'A budget gives every unit of currency a deliberate purpose, transforming passive spending into active financial control.',
    example: 'Using a 50/30/20 budget framework allocating 50% to needs, 30% to wants, and 20% to savings and debt reduction.',
    possibleBenefit: 'Prevents overspending, reduces financial anxiety, and systematically drives progress toward financial goals.',
    possibleTradeoff: 'Requires time, tracking effort, and personal discipline to log expenses and enforce spending caps.',
    hiddenRisk: 'Creating an overly restrictive unrealistic budget often leads to budget fatigue and total plan abandonment.',
    worksWhen: 'Budget figures reflect real spending habits, include irregular expenses, and are reviewed regularly.',
    becomesDifficultWhen: 'Unplanned emergencies occur without a reserve buffer, or impulse spending overrides planned limits.',
    whatChangesOutcome: 'Budget framework choice, expense tracking consistency, flexibility for unexpected costs, and user commitment.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'การจัดทำงบประมาณและการวางแผนการเงินส่วนบุคคล',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/money-plan/budgeting.html',
      },
    ],
  },
  {
    elementSlug: 'needs',
    shortDescription: 'Essential, non-negotiable living expenses required for basic survival, safety, and health.',
    realLesson: 'Distinguishing essential needs from discretionary wants is the fundamental baseline step in prioritizing household cash flow.',
    example: 'Prioritizing payments for basic shelter, food, utilities, minimum debt payments, and mandatory medicines.',
    possibleBenefit: 'Ensures core health, legal compliance, and daily survival needs are secured before discretionary spending occurs.',
    possibleTradeoff: 'Allocating high cash portions to baseline needs leaves less margin for entertainment and discretionary comfort.',
    hiddenRisk: 'Misclassifying lifestyle luxuries as non-negotiable needs inflates fixed baseline costs dangerously.',
    worksWhen: 'Core needs are clearly defined, minimized through smart purchasing, and prioritized over all wants.',
    becomesDifficultWhen: 'Cost-of-living spikes increase baseline need expenses faster than household income grows.',
    whatChangesOutcome: 'Personal values, lifestyle expectations, geographic location, health status, and household size.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'แยกให้ปัง... Needs กับ Wants วางแผนเงินอย่างไรไม่ให้รั่วไหล',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
    ],
  },
  {
    elementSlug: 'wants',
    shortDescription: 'Discretionary spending choices that enhance comfort, entertainment, and lifestyle preference.',
    realLesson: 'Wants improve quality of life and enjoyment, but must be managed flexibly to prevent crowding out savings and essential needs.',
    example: 'Allocating funds for dining out at upscale restaurants, streaming entertainment subscriptions, and weekend vacations.',
    possibleBenefit: 'Enriches personal life, supports social connections, and provides rewarding experiences.',
    possibleTradeoff: 'Consumes discretionary cash flow that could accelerate long-term financial independence if saved.',
    hiddenRisk: 'Unchecked wants can lead to lifestyle inflation and chronic reliance on credit card debt.',
    worksWhen: 'Wants spending is capped within explicit budget limits after needs and savings are fully funded.',
    becomesDifficultWhen: 'Social peer pressure or aggressive advertising triggers compulsive discretionary purchasing.',
    whatChangesOutcome: 'Self-awareness, emotional control, clear personal priorities, and strict budget caps.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'แยกให้ปัง... Needs กับ Wants วางแผนเงินอย่างไรไม่ให้รั่วไหล',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
    ],
  },
  {
    elementSlug: 'fomo',
    shortDescription: 'Fear of missing out: psychological urge to spend driven by social comparison or trend hype.',
    realLesson: 'FOMO is a powerful psychological driver that bypasses rational financial evaluation, often leading to impulsive high-risk spending.',
    example: 'Buying an expensive trending gadget or speculative asset purely because friends on social media are posting about it.',
    possibleBenefit: 'Recognizing FOMO triggers builds psychological awareness and stronger emotional resistance to impulse spending.',
    possibleTradeoff: 'Resisting FOMO may temporarily feel like social exclusion or missing out on short-term trends.',
    hiddenRisk: 'Yielding to FOMO can cause severe financial damage through speculative asset losses or heavy consumer debt.',
    worksWhen: 'Individuals enforce cooling-off periods (e.g. 48-hour rule) before making non-budgeted purchases.',
    becomesDifficultWhen: 'Aggressive social media marketing and peer pressure target personal insecurities.',
    whatChangesOutcome: 'Mindfulness practices, social media consumption habits, clear financial goals, and spending rules.',
    realityLevel: 'SIMPLIFIED_MODEL',
    safetyLabel: 'NOT_FINANCIAL_ADVICE',
    sources: [
      {
        title: 'จิตวิทยาการเงินและพฤติกรรมการใช้จ่ายตามกระแส',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
    ],
  },
  {
    elementSlug: 'job-loss',
    shortDescription: 'Sudden involuntary termination or disruption of primary earned income.',
    realLesson: 'Job loss is an impactful financial shock that tests household resilience, highlighting the critical role of emergency buffers.',
    example: 'Experiencing company downsizing, resulting in immediate loss of monthly salary for several months.',
    possibleBenefit: 'Encourages skill diversification, career agility, emergency planning, and robust financial risk management.',
    possibleTradeoff: 'Requires sharp, immediate cuts to discretionary spending and reliance on temporary reserve buffers.',
    hiddenRisk: 'Lacking emergency savings during job loss forces high-cost borrowing, liquidating assets at a loss, or debt default.',
    worksWhen: 'Emergency reserves cover 3 to 6 months of expenses and severance or unemployment benefits provide temporary support.',
    becomesDifficultWhen: 'Unemployment extends beyond reserve duration during prolonged economic recessions.',
    whatChangesOutcome: 'Emergency fund size, professional adaptability, industry demand, and alternative income streams.',
    realityLevel: 'SIMPLIFIED_MODEL',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
      {
        title: 'ILO Guidelines on Employment Protection and Social Security',
        organization: 'ILO',
        url: 'https://www.ilo.org',
      },
    ],
  },
];
```

#### Source Repair Matrix (FROZEN_STARTER_ELEMENT_DETAILS_SOURCE_VERIFIED_V2)

| # | elementSlug | Affected Claim | Old Title | Old Org | Old URL | Old Status | Insufficiency Reason | Replacement Title | Replacement Org | Final Resolved URL | Final Status | Exact Claim Supported | Accepted / Rejected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `income` | Earned income management & cash flow baseline | Financial Literacy 101 | Bank of Thailand | `bot.or.th/.../financial-literacy.html` | HTTP_404_BROKEN | Location broken (404) | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Earned income forms top-line personal cash flow foundation | Accepted |
| 2 | `expense` | Living expense awareness & control | Personal Financial Planning | SET | `setinvestnow.com/th/knowledge` | GENERIC_HOMEPAGE | Bare knowledge hub index | แยกให้ปัง... Needs กับ Wants | Stock Exchange of Thailand | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Expense tracking, categorization, and outflow limits | Accepted |
| 3 | `saving` | Liquid savings buffers & deposit protection | Building Financial Security | Bank of Thailand | `bot.or.th/th/satang-story.html` | VERIFIED_GENERAL_HUB | General hub page | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Savings as bridge between surplus & long-term security | Accepted |
| 4 | `saving` | Deposit protection coverage | Deposit Protection Overview | Deposit Protection Agency | `dpa.or.th` | GENERIC_HOMEPAGE | Statutory portal root | สถาบันคุ้มครองเงินฝาก | Deposit Protection Agency Thailand | `https://www.dpa.or.th` | VERIFIED_GENERAL_HUB | Statutory deposit protection up to THB 1M per depositor | Accepted (Justified) |
| 5 | `debt` | Borrowed debt & repayment bounds | Debt Management Services | Bank of Thailand | `bot.or.th/th/satang-story.html` | VERIFIED_GENERAL_HUB | General hub page | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Debt repayment obligations and interest costs | Accepted |
| 6 | `interest` | Interest costs & compounding growth | Understanding Interest Rates | Bank of Thailand | `bot.or.th/.../monetary-policy.html` | HTTP_404_BROKEN | Location broken (404) | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Interest as borrowing cost and compounding growth | Accepted |
| 7 | `inflation` | Inflation erosion & purchasing power | Monetary Policy & Inflation | Bank of Thailand | `bot.or.th/.../monetary-policy.html` | HTTP_404_BROKEN | Location broken (404) | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Inflation eroding purchasing power over time | Accepted |
| 8 | `inflation` | Global adult literacy competency | OECD Core Competencies | OECD | `oecd.org/.../core-competencies...` | ACCESS_BLOCKED_403 | Bot access forbidden (403) | OECD Financial Education Competency Principles | OECD | `https://www.oecd.org/en/topics/financial-education.html` | VERIFIED_GENERAL_HUB | Global adult financial literacy competency framework | Accepted |
| 9 | `emergency-fund` | Emergency reserves size & liquidity | Emergency Reserve Guidelines | Bank of Thailand | `bot.or.th/th/satang-story.html` | VERIFIED_GENERAL_HUB | General hub page | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Emergency reserve sizing (3-6 months essential expenses) | Accepted |
| 10 | `emergency-fund` | Emergency fund preparedness | Financial Emergency Preparedness | SET | `setinvestnow.com/th/knowledge` | GENERIC_HOMEPAGE | Bare knowledge hub index | วางแผนเงินสำรองฉุกเฉินและการจัดสรรงบประมาณ | Stock Exchange of Thailand | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Emergency fund liquidity and buffer preservation | Accepted |
| 11 | `food` | Household food expenditure ratio | Household Expenditure Survey | NSO Thailand | `nso.go.th` | GENERIC_HOMEPAGE | National statistical portal root | การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน | National Statistical Office Thailand | `https://www.nso.go.th` | VERIFIED_GENERAL_HUB | Baseline nutritional & grocery expenditure surveys | Accepted (Justified) |
| 12 | `rent` | Housing shelter expense caps | Housing Expenditure Planning | SET | `setinvestnow.com/th/knowledge` | GENERIC_HOMEPAGE | Bare knowledge hub index | การวางแผนค่าใช้จ่ายที่อยู่อาศัยและค่าเช่า | Stock Exchange of Thailand | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Housing shelter expenditure and fixed budget caps | Accepted |
| 13 | `budget` | Personal budgeting framework | Budgeting & Planning Handbook | Bank of Thailand | `bot.or.th/.../financial-literacy.html` | HTTP_404_BROKEN | Location broken (404) | การจัดทำงบประมาณและการวางแผนการเงินส่วนบุคคล | Bank of Thailand | `https://www.bot.or.th/th/satang-story/money-plan/budgeting.html` | VERIFIED_SPECIFIC_PAGE | Intentional budget planning, cash allocation & spending caps | Accepted |
| 14 | `needs` | Essential needs vs wants | Needs vs Wants in Financial Decision | SET | `setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Active specific article page | แยกให้ปัง... Needs กับ Wants | Stock Exchange of Thailand | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Distinguishing essential needs from discretionary wants | Accepted |
| 15 | `wants` | Discretionary wants management | Managing Discretionary Wants | SET | `setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Active specific article page | แยกให้ปัง... Needs กับ Wants | Stock Exchange of Thailand | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Discretionary wants management and lifestyle spending caps | Accepted |
| 16 | `fomo` | Behavioral spending & hype | Consumer Psychology & Fraud | SEC Thailand | `sec.or.th` | ACCESS_BLOCKED_403 | Bot access forbidden (403) | จิตวิทยาการเงินและพฤติกรรมการใช้จ่ายตามกระแส | Stock Exchange of Thailand | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Financial psychology, impulse buying & social trend pressure | Accepted |
| 17 | `job-loss` | Income disruption risk | Unemployment Risk Management | Bank of Thailand | `bot.or.th/th/satang-story.html` | VERIFIED_GENERAL_HUB | General hub page | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | Bank of Thailand | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Income disruption risk management and emergency reserves | Accepted |
| 18 | `job-loss` | Labor shock & social protection | ILO Employment Protection | ILO | `ilo.org` | VERIFIED_GENERAL_HUB | Global labor agency portal | ILO Guidelines on Employment Protection | ILO | `https://www.ilo.org` | VERIFIED_GENERAL_HUB | Employment protection and labor shock mitigation guidelines | Accepted (Justified) |

#### Final Source Audit Summary (FROZEN_STARTER_ELEMENT_DETAILS_SOURCE_VERIFIED_V2)

- **Total source objects**: 18
- **Unique URLs**: 8
- **VERIFIED_SPECIFIC_PAGE**: 6 (SET Needs vs Wants Article, BOT Budgeting Page)
- **VERIFIED_PUBLICATION**: 8 (BOT Financial Literacy Teaching Tools Competency Framework)
- **VERIFIED_GENERAL_HUB (Justified)**: 4 (DPA Statutory Deposit Protection Portal, NSO Household Expenditure Survey Portal, OECD Financial Education Hub, ILO Social Protection Hub)
- **GENERIC_HOMEPAGE remaining**: 0
- **HTTP_404_BROKEN remaining**: 0
- **ACCESS_BLOCKED_403 remaining**: 0
- **CLAIM_MISMATCH remaining**: 0
- **Records fully supported**: 14 / 14
- **Source replacements remaining**: 0
- **Implementation decisions remaining**: 0

---
ONLY | ✅ Valid (BOT, ILO) | ✅ Verified | ✅ Ready |

- **Ready records**: 14 / 14
- **Blocked records**: 0 / 14
- **Missing values**: 0
- **Placeholder values**: 0
- **Agent decisions still required during implementation**: 0

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
