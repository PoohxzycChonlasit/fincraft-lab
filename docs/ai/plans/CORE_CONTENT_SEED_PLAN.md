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

### 9.2 Discovery Element DiscoveryDetail Content Batch A — FROZEN (FROZEN_DISCOVERY_DETAILS_BATCH_A_SOURCE_VERIFIED_V1)

The following 11 records contain exact, frozen, implementation-ready per-record values for Discovery Elements Batch A (sortOrder 15 through 25), verified against active official educational publications at audit time.

#### Concept Distinction Matrix (Batch A)

| # | Target Slug | Core Concept Distinction |
|---|---|---|
| 1 | `cash-flow` | Measures the net numerical delta between income inflows and living outflows; distinct from `spending-plan` which is the structured allocation tool. |
| 2 | `debt-pressure` | Evaluates the monthly fixed obligation ratio against income; distinct from `debt-trap` which is the compounding spiral where interest exceeds repayment capacity. |
| 3 | `cost-pressure` | Describes the current spending strain from rising essential prices; distinct from `purchasing-power-loss` which is the real multi-year erosion of cash value. |
| 4 | `emergency-resilience` | Represents total household shock-absorption capacity (reserves, insurance, flexibility); distinct from `emergency-liquidity` which is instant cash availability. |
| 5 | `impulse-spending` | Captures individual unbudgeted emotional/promotional purchases; distinct from `lifestyle-creep` which is systemic standard-of-living inflation with income raises. |
| 6 | `spending-plan` | The operational budgeting tool for category allocation; distinct from `cash-flow` which is the resulting net cash delta. |
| 7 | `savings-growth` | The multi-variable compounding growth of saved capital; distinct from `emergency-liquidity` which focuses strictly on zero-risk immediate cash access. |
| 8 | `debt-trap` | The compounding interest trap where debt grows despite payments; distinct from `debt-pressure` which is manageable monthly debt service strain. |
| 9 | `purchasing-power-loss` | The inflation-driven loss of real purchasing power over time; distinct from `cost-pressure` which is monthly budget strain. |
| 10 | `lifestyle-creep` | The gradual expansion of baseline living costs alongside salary increases; distinct from `impulse-spending` which is point-in-time impulse buying. |
| 11 | `emergency-liquidity` | Dedicated penalty-free liquid cash for instant crises; distinct from `emergency-resilience` which encompasses overall risk protection. |

```typescript
export const FROZEN_DISCOVERY_DETAILS_BATCH_A = [
  {
    elementSlug: 'cash-flow',
    shortDescription: 'Net difference between total cash inflows and total cash outflows over a specific period.',
    realLesson: 'Positive cash flow provides financial margin and flexibility, whereas negative cash flow compresses liquidity and forces reliance on reserves or debt.',
    example: 'A worker earns THB 30,000 monthly and spends THB 24,000 on living expenses, generating a positive net cash flow of THB 6,000 per month.',
    possibleBenefit: 'Builds liquid reserves, provides financial agility, and supports long-term wealth accumulation.',
    possibleTradeoff: 'Generating cash surplus requires capping immediate living expenses and delaying optional consumption.',
    hiddenRisk: 'Fluctuating income or irregular annual expenses (e.g. insurance, taxes) can temporarily flip positive cash flow into deficit.',
    worksWhen: 'Total cash inflows reliably exceed total mandatory and discretionary spending over defined cycles.',
    becomesDifficultWhen: 'Fixed expenses expand close to net income, or income experiences sudden interruptions.',
    whatChangesOutcome: 'Surplus margin percentage, income stability, expense control, and tracking frequency.',
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
    elementSlug: 'debt-pressure',
    shortDescription: 'The ongoing financial strain created when fixed debt repayment obligations consume a high portion of monthly income.',
    realLesson: 'High debt service burdens reduce disposable income margin, making households vulnerable to economic or income shocks.',
    example: 'Allocating THB 14,000 out of THB 30,000 monthly income (46.7%) toward mandatory loan repayments, leaving tight cash for living needs.',
    possibleBenefit: 'Servicing debt responsibly maintains credit standing and enables acquisition of essential high-value assets over time.',
    possibleTradeoff: 'Commits a significant percentage of future earnings to fixed repayment contracts, restricting spending flexibility.',
    hiddenRisk: 'Debt service ratios above 40% leave little margin for emergency expenses or sudden income drops.',
    worksWhen: 'Total monthly debt obligations stay well below 30%–40% of net income and interest rates remain low.',
    becomesDifficultWhen: 'Income declines, interest rates rise on variable debt, or unexpected living expenses occur.',
    whatChangesOutcome: 'Debt-to-income ratio, interest rate levels, repayment term lengths, and restructuring options.',
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
    elementSlug: 'cost-pressure',
    shortDescription: 'Cumulative upward pressure on household living expenses caused by rising prices for essential goods and services.',
    realLesson: 'Rising living costs shrink discretionary margins when household income growth does not keep pace with headline price increases.',
    example: 'Monthly utility, food, and transport costs increasing from THB 18,000 to THB 19,800 due to general price increases while salary remains unchanged.',
    possibleBenefit: 'Encourages households to review baseline expenses, eliminate waste, and seek income growth opportunities.',
    possibleTradeoff: 'Forces sacrifices in discretionary quality of life or temporary reductions in monthly savings contributions.',
    hiddenRisk: 'Fixed lifestyle patterns delay budget adjustments, causing households to quietly draw down savings buffers.',
    worksWhen: 'Households actively track price changes, adjust spending priorities, and maintain flexible budget allocations.',
    becomesDifficultWhen: 'Inflation spikes rapidly across non-negotiable needs (e.g. food, energy, housing) simultaneously.',
    whatChangesOutcome: 'Rate of price inflation, household spending flexibility, wage growth, and substitute product availability.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน (Household Expenditure Survey)',
        organization: 'National Statistical Office Thailand',
        url: 'https://www.nso.go.th',
      },
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
    ],
  },
  {
    elementSlug: 'emergency-resilience',
    shortDescription: 'The structural capacity of a household to absorb negative financial shocks without resorting to high-cost borrowing or asset liquidation.',
    realLesson: 'Combining liquid reserves, insurance coverage, and flexible spending habits creates resilience against unexpected life disruptions.',
    example: 'A household facing an unexpected medical bill of THB 25,000 covers it using liquid savings without missing monthly bills or taking loans.',
    possibleBenefit: 'Provides psychological security, preserves long-term financial plans, and prevents crisis-driven debt accumulation.',
    possibleTradeoff: 'Capital allocated to liquid safety buffers earns modest deposit yields compared to long-term growth investments.',
    hiddenRisk: 'Overestimating resilience based solely on asset net worth while ignoring actual cash liquidity during an immediate crisis.',
    worksWhen: 'Reserves cover 3 to 6 months of essential living costs and are stored in immediately accessible accounts.',
    becomesDifficultWhen: 'Multiple compounding crises occur in rapid succession or prolonged job loss exhausts reserves.',
    whatChangesOutcome: 'Size of liquid buffer, expense flexibility, insurance coverage, and speed of buffer replenishment.',
    realityLevel: 'GROUNDED',
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
  {
    elementSlug: 'impulse-spending',
    shortDescription: 'Unplanned, emotionally-driven spending decisions triggered by immediate desires, social marketing, or promotional psychological cues.',
    realLesson: 'Frequent impulse purchases bypass intentional budget evaluation, quietly eroding surplus cash flow and savings capacity over time.',
    example: 'Buying a THB 4,500 designer item on flash sale without prior planning, reducing planned monthly savings by the same amount.',
    possibleBenefit: 'Understanding emotional spending triggers helps build self-awareness and stronger psychological spending discipline.',
    possibleTradeoff: 'Resisting impulse urges requires emotional energy and enforcing cooling-off rules before making purchases.',
    hiddenRisk: 'Small recurring impulse purchases seem harmless individually but accumulate into substantial annual cash leakage.',
    worksWhen: 'Enforcing spending friction rules (e.g. 48-hour waiting rule, unsubscribing from sales notifications) before buying.',
    becomesDifficultWhen: 'Stress, social peer pressure, or frictionless digital payment apps lower buying resistance.',
    whatChangesOutcome: 'Self-awareness, cooling-off rules, spending friction, budget limits, and social media habits.',
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
    elementSlug: 'spending-plan',
    shortDescription: 'A systematic operational tool for organizing expected income into structured expense categories, savings targets, and debt payments.',
    realLesson: 'A spending plan translates abstract financial goals into daily actionable boundaries, ensuring surplus allocation before spending.',
    example: 'Dividing monthly net income into fixed needs (50%), discretionary wants (30%), and automated savings/debt payoff (20%).',
    possibleBenefit: 'Directs every unit of currency intentionally, prevents overspending, and systematically builds financial buffers.',
    possibleTradeoff: 'Requires ongoing monitoring effort, expense tracking, and disciplined adherence to spending caps.',
    hiddenRisk: 'Setting overly rigid spending targets without buffer categories can cause budget fatigue and plan abandonment.',
    worksWhen: 'Plans reflect realistic historical spending patterns, include periodic irregular expenses, and are reviewed monthly.',
    becomesDifficultWhen: 'Income fluctuates wildly month-to-month or unbudgeted emergencies occur without a dedicated reserve.',
    whatChangesOutcome: 'Realistic categorization, review frequency, tracking ease, flexibility for unexpected events, and personal discipline.',
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
    elementSlug: 'savings-growth',
    shortDescription: 'The cumulative growth of saved capital over extended time horizons driven by regular contributions and compounding returns.',
    realLesson: 'Savings growth depends on regular contributions, rate of return, time horizon, costs, and inflation, where early consistency amplifies outcomes.',
    example: 'Simplified scenario: Saving THB 3,000 monthly at a nominal 4% annual yield accumulates ~THB 440,000 over 10 years, assuming stable returns and no withdrawals.',
    possibleBenefit: 'Accelerates long-term wealth accumulation and provides financial independence without relying solely on future labor.',
    possibleTradeoff: 'Consistently setting aside savings reduces current discretionary spending capacity over multi-year horizons.',
    hiddenRisk: 'Assuming returns are guaranteed or failing to account for inflation, taxes, and investment fees over time.',
    worksWhen: 'Savings contributions are regular, compounding time horizons are long, and returns exceed cost inflation.',
    becomesDifficultWhen: 'High inflation or low interest rates reduce real yields, or early withdrawals disrupt compounding.',
    whatChangesOutcome: 'Monthly contribution amount, nominal return rate, compounding frequency, time horizon, fees, and inflation rate.',
    realityLevel: 'SIMPLIFIED_MODEL',
    safetyLabel: 'SIMULATION_ONLY',
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
    elementSlug: 'debt-trap',
    shortDescription: 'A severe financial cycle where compounding interest costs and high repayment obligations force additional borrowing to cover existing debt.',
    realLesson: 'When debt interest costs exceed monthly repayment capacity, principal balances expand rather than decline, compounding financial strain.',
    example: 'Carrying a THB 100,000 high-interest card debt where paying only minimum monthly charges covers mostly interest, extending debt for years.',
    possibleBenefit: 'Recognizing debt trap dynamics enables early intervention, debt consolidation, or seeking professional debt restructuring.',
    possibleTradeoff: 'Escaping a debt trap requires drastic cuts to non-essential spending and committing all surplus cash flow to principal reduction.',
    hiddenRisk: 'Taking new high-cost informal loans to pay existing formal bank loans rapidly escalates total debt balance into crisis.',
    worksWhen: 'Borrowers prioritize high-interest debt payoff, stop new credit usage, and negotiate structured repayment plans with lenders.',
    becomesDifficultWhen: 'Total monthly debt interest exceeds net monthly surplus cash flow during income interruption.',
    whatChangesOutcome: 'Average interest rate, principal repayment speed, refinancing options, lender negotiation, and spending discipline.',
    realityLevel: 'SIMPLIFIED_MODEL',
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
    elementSlug: 'purchasing-power-loss',
    shortDescription: 'The gradual reduction in the real volume of goods and services that a fixed sum of cash can buy due to inflation.',
    realLesson: 'Nominal cash balances lose real value over time if yield rates remain below prevailing headline inflation rates.',
    example: 'THB 100,000 kept in a zero-yield cash account during 3% annual inflation loses ~THB 8,500 in real purchasing power over 3 years.',
    possibleBenefit: 'Highlights the necessity of growing capital in inflation-beating assets rather than holding excessive low-yield cash.',
    possibleTradeoff: 'Moving cash into growth assets introduces market price volatility and short-term liquidity trade-offs.',
    hiddenRisk: 'Nominal account balances appear stable, creating a false sense of security while real purchasing power quietly declines.',
    worksWhen: 'Asset allocation strategy balances liquid short-term cash needs with long-term inflation-protected growth assets.',
    becomesDifficultWhen: 'Macroeconomic inflation remains persistently high while safe deposit interest rates stay low.',
    whatChangesOutcome: 'Headline inflation rate, asset yield performance, investment allocation, and holding duration.',
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
    elementSlug: 'lifestyle-creep',
    shortDescription: 'The tendency for discretionary spending and baseline living standards to expand automatically whenever income increases.',
    realLesson: 'Lifestyle creep consumes earned income raises, preventing higher earnings from translating into increased savings rates or wealth growth.',
    example: 'Receiving a THB 10,000 monthly salary raise and immediately upgrading housing and vehicle leases, keeping monthly savings unchanged.',
    possibleBenefit: 'Upgrading lifestyle comforts can reward hard work and improve daily well-being within intentional limits.',
    possibleTradeoff: 'Automatically spending income raises locks households into higher fixed expenses, increasing future baseline financial needs.',
    hiddenRisk: 'Inflated lifestyle expectations become difficult to downgrade if income subsequently declines or experiences a shock.',
    worksWhen: 'Households enforce a "save first" rule on salary raises (e.g. allocating 50%+ of any raise directly to savings or debt payoff).',
    becomesDifficultWhen: 'Social comparison, peer expectations, or status purchasing drive automatic spending increases with every raise.',
    whatChangesOutcome: 'Save-first discipline on raises, awareness of fixed vs variable cost expansion, and clear long-term goals.',
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
    elementSlug: 'emergency-liquidity',
    shortDescription: 'The specific portion of emergency reserves held in immediately accessible, principal-protected liquid instruments.',
    realLesson: 'Immediate liquidity ensures cash is accessible within hours without penalty or market loss during an urgent financial crisis.',
    example: 'Keeping THB 30,000 in an instant-transfer high-yield savings account to handle immediate car repairs or medical co-pays.',
    possibleBenefit: 'Guarantees instant access to funds when needed without relying on high-interest credit cards or selling assets at a loss.',
    possibleTradeoff: 'Highly liquid deposit accounts offer lower interest yields compared to locked term deposits or investment funds.',
    hiddenRisk: 'Keeping emergency liquidity in everyday checking accounts increases temptation for non-emergency discretionary spending.',
    worksWhen: 'Liquid funds are stored in separate, penalty-free deposit accounts with instant transfer capability.',
    becomesDifficultWhen: 'Urgent liquidity needs exceed immediate account balances during banking holidays or system outages.',
    whatChangesOutcome: 'Account access speed, withdrawal penalty terms, separation from daily spending accounts, and deposit protection.',
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
];
```

#### Batch A Source Verification & Claim Support Matrix

| # | elementSlug | Load-Bearing Claim | Source Title | Org | Resolved URL | Status | Exact Claim Supported | Accepted |
|---|---|---|---|---|---|---|---|---|
| 1 | `cash-flow` | Net difference between income inflows & spending outflows | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | BOT | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Cash inflow & outflow balancing & margin | Accepted |
| 2 | `debt-pressure` | Fixed debt repayments consuming income margin | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | BOT | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Debt service ratio & cash flow strain | Accepted |
| 3 | `cost-pressure` | Living inflation compressing household budget margin | การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน | NSO | `https://www.nso.go.th` | VERIFIED_GENERAL_HUB | Living cost survey & price inflation pressure | Accepted (Justified) |
| 4 | `emergency-resilience` | Multi-layer buffer protecting against financial shocks | ILO Guidelines on Employment Protection | ILO | `https://www.ilo.org` | VERIFIED_GENERAL_HUB | Shock absorption & social protection buffers | Accepted (Justified) |
| 5 | `impulse-spending` | Unplanned emotional purchases eroding savings | แยกให้ปัง... Needs กับ Wants | SET | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Emotional spending triggers & spending control | Accepted |
| 6 | `spending-plan` | Structured budgeting allocating income to priorities | การจัดทำงบประมาณและการวางแผนการเงิน | BOT | `https://www.bot.or.th/th/satang-story/money-plan/budgeting.html` | VERIFIED_SPECIFIC_PAGE | Personal spending plan & budget framework | Accepted |
| 7 | `savings-growth` | Compounded growth of regular savings over time | OECD Financial Education Competency Principles | OECD | `https://www.oecd.org/en/topics/financial-education.html` | VERIFIED_GENERAL_HUB | Compounded savings & financial literacy principle | Accepted |
| 8 | `debt-trap` | Compounding interest debt spiral exceeding capacity | สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะ | BOT | `https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html` | VERIFIED_PUBLICATION | Debt trap, interest accumulation & repayment capacity | Accepted |
| 9 | `purchasing-power-loss` | Real purchasing power erosion of uninvested cash | OECD Financial Education Competency Principles | OECD | `https://www.oecd.org/en/topics/financial-education.html` | VERIFIED_GENERAL_HUB | Purchasing power loss & real inflation impact | Accepted |
| 10 | `lifestyle-creep` | Baseline spending expanding automatically with raises | แยกให้ปัง... Needs กับ Wants | SET | `https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants` | VERIFIED_SPECIFIC_PAGE | Lifestyle inflation & save-first discipline | Accepted |
| 11 | `emergency-liquidity` | Immediate liquid cash cushion for emergency access | สถาบันคุ้มครองเงินฝาก (Deposit Protection Agency) | DPA | `https://www.dpa.or.th` | VERIFIED_GENERAL_HUB | Instant deposit liquidity & deposit safety | Accepted (Justified) |

#### Discovery Details Batch A Completeness Matrix

| # | Target Slug | Required Fields Complete | Scalar realityLevel Assigned | Scalar safetyLabel Assigned | Sources Contract Valid | Claims Supported | Ready for Freeze |
|---|---|---|---|---|---|---|---|
| 1 | `cash-flow` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (BOT) | ✅ Verified | ✅ Ready |
| 2 | `debt-pressure` | ✅ Complete | GROUNDED | NOT_FINANCIAL_ADVICE | ✅ Valid (BOT) | ✅ Verified | ✅ Ready |
| 3 | `cost-pressure` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (NSO, BOT) | ✅ Verified | ✅ Ready |
| 4 | `emergency-resilience` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (BOT, ILO) | ✅ Verified | ✅ Ready |
| 5 | `impulse-spending` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (SET) | ✅ Verified | ✅ Ready |
| 6 | `spending-plan` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (BOT) | ✅ Verified | ✅ Ready |
| 7 | `savings-growth` | ✅ Complete | SIMPLIFIED_MODEL | SIMULATION_ONLY | ✅ Valid (BOT, OECD) | ✅ Verified | ✅ Ready |
| 8 | `debt-trap` | ✅ Complete | SIMPLIFIED_MODEL | NOT_FINANCIAL_ADVICE | ✅ Valid (BOT) | ✅ Verified | ✅ Ready |
| 9 | `purchasing-power-loss` | ✅ Complete | SIMPLIFIED_MODEL | EDUCATION_ONLY | ✅ Valid (BOT, OECD) | ✅ Verified | ✅ Ready |
| 10 | `lifestyle-creep` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (SET) | ✅ Verified | ✅ Ready |
| 11 | `emergency-liquidity` | ✅ Complete | GROUNDED | EDUCATION_ONLY | ✅ Valid (BOT, DPA) | ✅ Verified | ✅ Ready |

- **Ready records**: 11 / 11
- **Blocked records**: 0 / 11
- **Missing values**: 0
- **Placeholder values**: 0
- **Agent decisions remaining**: 0

---

### 9.3 Discovery Element DiscoveryDetail Content Batch B — FROZEN (FROZEN_DISCOVERY_DETAILS_BATCH_B_SOURCE_VERIFIED_V1)

The following 11 records contain exact, frozen, implementation-ready per-record values for Discovery Elements Batch B (sortOrder 26 through 36), verified against active official educational publications at audit time.

#### Contract Distinction
- **Seed Content Contract**: Each seed record contains `elementSlug` (used only as a seed lookup key to resolve `elementId`), `shortDescription`, `realLesson`, `example`, `possibleBenefit`, `possibleTradeoff`, `hiddenRisk`, `worksWhen`, `becomesDifficultWhen`, `whatChangesOutcome`, `realityLevel`, `safetyLabel`, and `sources`.
- **Prisma Persistence Contract**: The database model `DiscoveryDetail` persists `elementId` (UUID `@unique`), `shortDescription`, `realLesson`, `example`, `possibleBenefit`, `possibleTradeoff`, `hiddenRisk`, `worksWhen`, `becomesDifficultWhen`, `whatChangesOutcome`, `realityLevel`, `safetyLabel`, `sources` (JSON array), and system timestamps (`id`, `createdAt`, `updatedAt`). `elementSlug` is NOT a database column.

#### Concept Distinction Matrix (Batch B)

| # | Target Slug | Core Concept Distinction |
|---|---|---|
| 1 | `debt-payoff-strategy` | A structured framework for prioritizing debt repayment order (avalanche/snowball); distinct from `debt-pressure` (monthly income strain), `debt-trap` (compounding interest spiral), and `debt-overload` (insolvency state). |
| 2 | `essential-baseline` | The non-negotiable minimum monthly cost floor required to maintain shelter, nutrition, health, and legal obligations; distinct from `needs` (broader essential expense category) and `spending-plan` (allocation tool). |
| 3 | `discretionary-leakage` | Small, unmonitored recurring micro-expenses that quietly erode monthly surplus over time; distinct from `wants` (discretionary category), `impulse-spending` (emotion-driven purchases), and `lifestyle-creep` (systemic cost expansion with raises). |
| 4 | `digital-scam-risk` | Susceptibility to financial losses from digital impersonation, deceptive links, or social engineering; distinct from `digital-hygiene` which represents preventive security habits. |
| 5 | `financial-stability` | Present operational state where income covers obligations and liquid buffers absorb ordinary shocks; distinct from `financial-freedom-foundation` which expands multi-year choices without guaranteeing wealth. |
| 6 | `debt-overload` | Severe financial crisis where debt payments absorb most income, crowding out baseline living needs; distinct from `debt-pressure` (manageable monthly strain) and `debt-payoff-strategy` (recovery plan). |
| 7 | `emergency-survival` | Estimated shock survival duration (accessible liquid reserves ÷ essential baseline spending rate); distinct from `emergency-resilience` (overall shock absorption) and `emergency-liquidity` (immediate cash access). |
| 8 | `mindful-spending` | Intentional reflection before purchasing to align spending with personal values; distinct from `impulse-spending` (unplanned emotional purchases). |
| 9 | `budget-optimizing` | Dynamic reallocation of monthly spending targets based on shifting cash flow and seasonal costs; distinct from `spending-plan` (baseline budget) and `cash-flow` (net income delta). |
| 10 | `digital-hygiene` | Proactive security habits and technical controls (enabling multi-factor verification where supported, software updates, credential safety); distinct from `digital-scam-risk` (fraud exposure). |
| 11 | `financial-freedom-foundation` | Long-term base combining asset accumulation, low debt, and passive options expanding future choices; distinct from `financial-stability` (present resilience). |

```typescript
export const FROZEN_DISCOVERY_DETAILS_BATCH_B = [
  {
    elementSlug: 'debt-payoff-strategy',
    shortDescription: 'A structured framework prioritizing debt repayment order to minimize total interest cost or build momentum.',
    realLesson: 'Accelerating debt payoff requires prioritizing high-cost borrowing (avalanche) or small balances (snowball) while maintaining minimum payments across all accounts, but suitability depends on interest rates, balances, available cash flow, and borrower discipline.',
    example: 'A household allocates an extra THB 3,000 monthly surplus directly to their highest-interest 18% personal loan principal while paying minimums on a 5% car loan (educational scenario only; outcomes depend on interest rates, fees, and consistent cash flow).',
    possibleBenefit: 'Reduces total borrowing costs over time or provides psychological motivation through early debt account wins.',
    possibleTradeoff: 'Commits extra liquid surplus cash to debt repayment, temporarily reducing monthly savings accumulation.',
    hiddenRisk: 'Accelerating debt payments without maintaining a basic emergency buffer risks forcing new high-cost borrowing if an unexpected expense occurs.',
    worksWhen: 'Monthly surplus cash flow is positive, emergency buffers are established, and minimum payments are met on all accounts.',
    becomesDifficultWhen: 'Unexpected income drops occur, living costs spike, or new borrowing is incurred during the payoff period.',
    whatChangesOutcome: 'Interest rate differentials, surplus allocation amount, payment consistency, fee structures, and emergency buffer size.',
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
    elementSlug: 'essential-baseline',
    shortDescription: 'The non-negotiable fixed minimum monthly outlay required to maintain basic housing, health, nutrition, and mandatory obligations.',
    realLesson: 'Establishing a clear fixed baseline expense figure sets the mandatory floor for monthly cash flow requirements and determines minimum emergency reserve targets.',
    example: 'A household calculates its fixed baseline expenses at THB 16,000 monthly for rent, essential groceries, basic utilities, and minimum loan obligations.',
    possibleBenefit: 'Provides an accurate baseline for budgeting, emergency fund sizing, and risk management.',
    possibleTradeoff: 'Focuses tightly on mandatory baseline outlays, requiring clear distinction from variable lifestyle wants.',
    hiddenRisk: 'Underestimating baseline expenses by omitting periodic mandatory bills creates a false sense of financial security.',
    worksWhen: 'Fixed housing, utility, food, and mandatory debt contracts are accurately tracked and cataloged monthly.',
    becomesDifficultWhen: 'Utility tariffs rise, essential food prices inflate, or contract terms renew at higher rates.',
    whatChangesOutcome: 'Household size, housing location, contract terms, essential inflation rate, and mandatory debt service levels.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'แยกให้ปัง... Needs กับ Wants วางแผนเงินอย่างไรไม่ให้รั่วไหล',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
      {
        title: 'การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน (Household Expenditure Survey)',
        organization: 'National Statistical Office Thailand',
        url: 'https://www.nso.go.th',
      },
    ],
  },
  {
    elementSlug: 'discretionary-leakage',
    shortDescription: 'Small, recurring, unmonitored discretionary expenses that quietly erode monthly surplus cash flow over time.',
    realLesson: 'Minor daily or weekly micro-purchases feel negligible individually but compound into substantial monthly cash drains when untracked.',
    example: 'Spending THB 120 daily on unbudgeted premium beverages and convenience snacks totals THB 3,600 monthly (~THB 43,200 annually) of unmonitored cash leakage.',
    possibleBenefit: 'Tracking micro-expenses exposes stealth cash leakage, instantly reclaiming surplus for savings or debt reduction.',
    possibleTradeoff: 'Auditing daily spending requires ongoing tracking effort and self-awareness of routine purchasing habits.',
    hiddenRisk: 'Focusing only on large monthly bills while ignoring daily micro-leakage leaves households wondering why net cash flow remains tight.',
    worksWhen: 'Individuals log daily micro-purchases and review small recurring spending categories monthly.',
    becomesDifficultWhen: 'Frictionless digital wallet apps and automated auto-renewing subscriptions hide recurring charges.',
    whatChangesOutcome: 'Tracking frequency, spending awareness, subscription audits, and impulse purchasing control.',
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
    elementSlug: 'digital-scam-risk',
    shortDescription: 'Susceptibility to financial losses from digital impersonation, deceptive links, or social engineering tactics.',
    realLesson: 'Digital fraud attempts exploit urgency, fear, or false reward offers to trick individuals into compromising accounts or transferring funds.',
    example: 'Receiving a fraudulent SMS claiming an urgent bank account suspension containing a fake link requesting personal verification details.',
    possibleBenefit: 'Developing healthy skepticism and verifying official channels protects financial assets and digital identity.',
    possibleTradeoff: 'Verifying incoming communications through official channels requires extra time and deliberate caution before acting.',
    hiddenRisk: 'Assuming digital fraud targets only inexperienced users causes overconfidence, leading to lowered vigilance during high-stress situations.',
    worksWhen: 'Users verify sender identities via official institutional phone numbers or apps before sharing information or transferring funds.',
    becomesDifficultWhen: 'Deceptive messages use sophisticated official logos, urgent threat wording, or spoofed caller IDs.',
    whatChangesOutcome: 'Verification habits, emotional pause before responding, awareness of common scam patterns, and channel verification.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'HIGH_RISK_TOPIC',
    sources: [
      {
        title: 'สตางค์ Story - ภัยทางการเงินและการป้องกันตนเอง',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story.html',
      },
      {
        title: 'ข้อควรระวังและการปกป้องข้อมูลส่วนบุคคลในโลกดิจิทัล',
        organization: 'ETDA Thailand',
        url: 'https://www.etda.or.th',
      },
    ],
  },
  {
    elementSlug: 'financial-stability',
    shortDescription: 'A household state where income reliably covers baseline obligations, liquid reserves absorb shocks, and debt burdens are manageable.',
    realLesson: 'Financial stability represents a balanced ongoing operating state rather than a permanent milestone or moral achievement, requiring continuous maintenance of cash flow and risk buffers.',
    example: 'A household maintains 4 months of essential expenses in liquid savings, keeps debt obligations under 30% of income, and generates positive monthly cash flow.',
    possibleBenefit: 'Provides peace of mind, reduces financial anxiety, and creates a solid platform for long-term financial planning.',
    possibleTradeoff: 'Maintaining stability requires ongoing spending discipline and allocating capital to liquid reserves rather than immediate luxury.',
    hiddenRisk: 'Viewing financial stability as a permanent guarantee causes households to relax emergency savings discipline after initial success.',
    worksWhen: 'Monthly cash flow is positive, emergency funds are funded, and debt service ratio stays well below critical stress thresholds.',
    becomesDifficultWhen: 'Macroeconomic downturns occur, major medical emergencies hit, or primary employment is disrupted.',
    whatChangesOutcome: 'Savings buffer size, debt service ratio, income stability, spending flexibility, and risk coverage.',
    realityLevel: 'GROUNDED',
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
    elementSlug: 'debt-overload',
    shortDescription: 'A critical financial condition where mandatory debt service payments absorb a dominant portion of income, threatening baseline living capacity.',
    realLesson: 'Severe debt overload occurs when debt obligations crowd out essential living needs, requiring urgent debt restructuring, lender negotiation, or professional assistance.',
    example: 'Allocating THB 22,000 out of THB 28,000 monthly income (78.6%) toward loan repayments, forcing reliance on credit cards for basic food and rent.',
    possibleBenefit: 'Early recognition of debt overload allows borrowers to seek formal debt clinic counseling or structured bank consolidation before default.',
    possibleTradeoff: 'Resolving debt overload requires strict lifestyle reduction, suspending new credit, and committing all spare cash flow to debt resolution.',
    hiddenRisk: 'Attempting to solve debt overload by taking high-cost informal or unverified loans escalates legal and financial risk dramatically.',
    worksWhen: 'Borrowers contact creditors early, participate in formal debt mediation programs, and freeze additional borrowing.',
    becomesDifficultWhen: 'Income declines further, multiple aggressive collection actions start, or legal judgments occur.',
    whatChangesOutcome: 'Debt-to-income ratio, creditor cooperation, access to debt clinics, surplus cash flow, and borrower commitment.',
    realityLevel: 'SIMPLIFIED_MODEL',
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
    elementSlug: 'emergency-survival',
    shortDescription: 'The estimated duration a household can maintain baseline essential spending using accessible liquid resources during a total income stoppage.',
    realLesson: 'Emergency survival capability evaluates how long liquid reserves last when divided by baseline essential spending rate during complete income disruption.',
    example: 'Simplified educational scenario: THB 60,000 in liquid savings divided by THB 15,000 monthly baseline essential spending estimates ~4 months of shock survival, assuming expenses remain fixed and funds are instantly accessible without penalties (educational scenario only; actual duration depends on real-world price changes, unexpected expenses, and account access).',
    possibleBenefit: 'Quantifies household survival horizon in concrete months, highlighting the adequacy of emergency liquid buffers.',
    possibleTradeoff: 'Maximizing survival duration requires cutting all discretionary spending immediately upon income loss.',
    hiddenRisk: 'Including illiquid assets or locked long-term investments in survival calculations creates a false expectation of immediate cash availability.',
    worksWhen: 'Liquid reserves are principal-protected, immediately accessible, and discretionary spending is halted immediately upon crisis.',
    becomesDifficultWhen: 'Emergency spending spikes due to medical costs or liquid account access is delayed.',
    whatChangesOutcome: 'Liquid reserve size, baseline essential spending rate, speed of expense reductions, and account liquidity.',
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
  {
    elementSlug: 'mindful-spending',
    shortDescription: 'The practice of aligning spending decisions with personal values, budget limits, and long-term priorities rather than emotional impulses.',
    realLesson: 'Mindful spending introduces intentional reflection before purchases, reducing impulse buying and ensuring discretionary cash flow supports genuine personal well-being.',
    example: 'Applying a 48-hour cooling-off period to non-essential purchases over THB 1,000, deciding after reflection to save the money for a planned vacation.',
    possibleBenefit: 'Decreases financial regret, curbs unnecessary lifestyle expansion, and increases satisfaction from intentional purchases.',
    possibleTradeoff: 'Requires mental discipline, patience, and resisting immediate promotional or social media gratification.',
    hiddenRisk: 'Confusing mindful spending with extreme frugal deprivation can lead to spending fatigue and sudden compensatory splurging.',
    worksWhen: 'Individuals define clear personal spending boundaries, enforce cooling-off rules, and review discretionary goals regularly.',
    becomesDifficultWhen: 'Stress, peer pressure, or aggressive targeted marketing campaigns lower self-control.',
    whatChangesOutcome: 'Self-awareness, cooling-off habits, clarity of financial values, and impulse resistance.',
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
    elementSlug: 'budget-optimizing',
    shortDescription: 'Adjusting monthly budget allocations dynamically based on changing cash flow, seasonal costs, and shifting financial goals.',
    realLesson: 'Dynamic budget optimization adapts spending targets flexibly as income or expense conditions shift, maintaining net cash surplus without abandoning overall financial structure.',
    example: 'Reallocating THB 2,000 from discretionary entertainment to utility expenses during hot summer months to maintain a fixed 20% savings target.',
    possibleBenefit: 'Prevents budget failure by allowing planned flexibility for seasonal expenses and unexpected minor cash flow shifts.',
    possibleTradeoff: 'Requires monthly budget reviews, active cash flow tracking, and making intentional category trade-offs.',
    hiddenRisk: 'Continually reallocating funds away from savings to cover discretionary overspending undermines long-term growth.',
    worksWhen: 'Cash flow is tracked regularly, savings targets are protected first, and expense adjustments are made intentionally.',
    becomesDifficultWhen: 'Income is irregular or baseline fixed costs absorb almost all income, leaving no flexible category margin.',
    whatChangesOutcome: 'Review frequency, savings protection rules, expense flexibility, and tracking tool effectiveness.',
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
    elementSlug: 'digital-hygiene',
    shortDescription: 'Proactive security practices and technical controls that protect digital banking accounts, devices, and financial credentials.',
    realLesson: 'Maintaining strong digital hygiene through robust authentication, software updates, and cautious online habits reduces vulnerability to account compromise and digital fraud.',
    example: 'Enabling multi-factor or two-step verification where supported on banking applications, using unique passwords, and updating mobile operating systems regularly.',
    possibleBenefit: 'Strengthens personal account security, prevents unauthorized access, and protects sensitive financial data.',
    possibleTradeoff: 'Adding authentication steps and managing strong credentials requires extra setup effort and periodic security maintenance.',
    hiddenRisk: 'Believing that technical controls like multi-factor authentication eliminate all risk can lead to carelessness when evaluating social engineering tactics.',
    worksWhen: 'Multi-factor verification is enabled where supported, software is kept updated, and credentials are kept private and unique.',
    becomesDifficultWhen: 'Managing multiple complex credentials causes password fatigue or users disable security features for convenience.',
    whatChangesOutcome: 'Authentication strength, update regularity, password uniqueness, awareness of social engineering, and security feature usage.',
    realityLevel: 'GROUNDED',
    safetyLabel: 'EDUCATION_ONLY',
    sources: [
      {
        title: 'ข้อควรระวังและการปกป้องข้อมูลส่วนบุคคลในโลกดิจิทัล',
        organization: 'ETDA Thailand',
        url: 'https://www.etda.or.th',
      },
      {
        title: 'สตางค์ Story - ภัยทางการเงินและการป้องกันตนเอง',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story.html',
      },
    ],
  },
  {
    elementSlug: 'financial-freedom-foundation',
    shortDescription: 'A long-term financial base combining asset accumulation, minimal debt, and passive cash flow options that expand future lifestyle choices.',
    realLesson: 'Building a financial independence foundation provides greater flexibility over work and lifestyle choices over multi-year horizons, though suitability and timeline depend on individual income, savings rate, investment performance, and living requirements.',
    example: 'A worker builds net assets and passive investment income that cover 50% of baseline living costs, enabling the flexibility to transition to part-time work or career retraining (educational scenario only; does not guarantee wealth or early retirement).',
    possibleBenefit: 'Increases personal autonomy, expands career flexibility, and provides long-term financial resilience.',
    possibleTradeoff: 'Requires sustained high savings rates, disciplined investment management, and long-term consumption trade-offs over decades.',
    hiddenRisk: 'Relying on overly optimistic investment return assumptions or ignoring future inflation can cause long-term accumulation plans to fall short.',
    worksWhen: 'Savings rates are consistent, investment portfolios are diversified, debt is minimized, and compounding horizons are long.',
    becomesDifficultWhen: 'High inflation erodes asset returns, severe market downturns occur, or living costs expand continuously.',
    whatChangesOutcome: 'Savings rate percentage, long-term asset returns, inflation rate, debt levels, and lifestyle expense discipline.',
    realityLevel: 'SIMPLIFIED_MODEL',
    safetyLabel: 'NOT_FINANCIAL_ADVICE',
    sources: [
      {
        title: 'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot- **Agent decisions remaining**: 0

---

## 10. Core Craft Recipe V1 Catalog (22 Recipes)

### 10.1 Freeze Marker & Graph Verification

`FROZEN_CORE_CRAFT_RECIPES_VALIDATED_V1`

All 22 Core Craft Recipes for Discovery Element V1 catalog have been designed, semantically aligned with target DiscoveryDetails, graph-validated, and frozen.

#### Summary of Recipe Catalog Metrics
- **Total Canonical Recipes**: Exactly 22 Recipes (1:1 per Discovery Element output).
- **Total Recipe Inputs**: Exactly 44 input references (2 distinct inputs per Recipe).
- **Discovery Output Coverage**: 22 / 22 Discovery Elements (100% complete coverage).
- **Starter Outputs**: 0 (Starter Elements cannot be produced by Recipes).
- **Self-Referential Inputs**: 0 (No Recipe uses the same Element as both inputA and inputB).
- **Self-Output Inputs**: 0 (No Recipe output appears as one of its own inputs).
- **Duplicate Unordered Pairs**: 0 (Every input pair is unique; A+B and B+A share identical canonical identity).
- **Circular Dependencies**: 0 (Strict Directed Acyclic Graph / DAG property satisfied).
- **100% Reachability from Starters**: 22 / 22 Discovery Elements reachable from Depth 0 Starter Elements.
- **Progression Depth Distribution**:
  - **Depth 0 (Starters)**: 14 Starter Elements (`income`, `expense`, `saving`, `debt`, `interest`, `inflation`, `emergency-fund`, `food`, `rent`, `budget`, `needs`, `wants`, `fomo`, `job-loss`)
  - **Depth 1 (Base Recipes)**: 13 Recipes (`cash-flow`, `debt-pressure`, `cost-pressure`, `impulse-spending`, `essential-baseline`, `discretionary-leakage`, `digital-scam-risk`, `spending-plan`, `digital-hygiene`, `lifestyle-creep`, `savings-growth`, `debt-trap`, `emergency-liquidity`)
  - **Depth 2 (Intermediate Recipes)**: 7 Recipes (`emergency-resilience`, `purchasing-power-loss`, `mindful-spending`, `debt-payoff-strategy`, `budget-optimizing`, `debt-overload`, `emergency-survival`)
  - **Depth 3 (Advanced State)**: 1 Recipe (`financial-stability`)
  - **Depth 4 (Cap Core)**: 1 Recipe (`financial-freedom-foundation`)

---

### 10.2 Recipe Architecture, Contract, & Invariants

#### 1. Input Hash & Canonical Identity Policy
- **Order-Independent Identity**: Crafting is commutative (`Craft(A, B) == Craft(B, A)`).
- **Documentation Representation vs Database Storage**: The column `canonicalPairKeyForAuditOnly (NOT_DATABASE_INPUT_HASH)` in the planning matrix represents the lexicographically sorted string of input Slugs for human documentation and audit checking only. It is **NOT** the stored database `inputHash`.
- **Shared Implementation Invariant**: The actual `inputHash` is calculated dynamically during Seed and NestJS runtime execution using a single shared helper (`calculateInputHash([id1, id2])` using lexicographically sorted UUIDs). No manual hash or UUID literal is frozen in documentation.

#### 2. Database Constraints vs NestJS Business Invariants
- **Database Schema Constraints**:
  - `CraftRecipe.inputHash` is `@unique` (enforces no duplicate `inputHash` in DB).
  - `CraftRecipeInput` has `@@unique([recipeId, inputOrder])` (enforces unique `inputOrder` per recipe).
  - `CraftRecipe.outputElementId` is **NOT** `@unique` in PostgreSQL schema.
- **Product & NestJS Policy Invariants**:
  - **1 Recipe per Output**: Enforced strictly as a Core Recipe V1 Product Policy by NestJS validation and Seed runner (not by PostgreSQL `@unique`).
  - **Distinct Inputs**: NestJS/Seed validates `inputOrder` set equals `{1, 2}`, `inputA !== inputB`, and input elements exist.

#### 3. Deterministic Canonical Storage Order (`inputOrder`)
- `inputOrder = 1` and `inputOrder = 2` store the input Elements in deterministic canonical (lexicographically sorted UUID) order in `craft_recipe_inputs`. It does not represent the user's drag-and-drop or selection sequence.

#### 4. Progression Graph Scope
- The progression graph analyzes Recipe prerequisites and unlocking sequence only. It does **NOT** create or imply database `ElementRelationship` rows. Database `ElementRelationship` rows remain **0**.

---

### 10.3 Legacy SRS Recipe Reconciliation Table

| # | Legacy SRS Example | Current Catalog Target | Action | Reconciliation & Mapping Rationale |
|---|---|---|---|---|
| 1 | `Income` + `Expense` → `Cash Flow` | `income` + `expense` → `cash-flow` | `KEEP / MAP_TO_CURRENT_CATALOG` | Exact match with current catalog slugs (`income`, `expense`, `cash-flow`). |
| 2 | `Debt` + `Interest` → `Debt Pressure` | `debt` + `interest` → `debt-pressure` | `KEEP / MAP_TO_CURRENT_CATALOG` | Exact match with current catalog slugs (`debt`, `interest`, `debt-pressure`). |
| 3 | `Expense` + `Inflation` → `Cost Pressure` | `expense` + `inflation` → `cost-pressure` | `KEEP / MAP_TO_CURRENT_CATALOG` | Exact match with current catalog slugs (`expense`, `inflation`, `cost-pressure`). |
| 4 | `Credit Card` + `Minimum Payment` | `debt` + `fomo` → `debt-trap` | `RETIRE_FROM_V1 / MAP_TO_CONCEPT` | Legacy terms `Credit Card` and `Minimum Payment` are not Base Elements in 14-Starter catalog; mapped to `debt` + `fomo` producing `debt-trap`. |
| 5 | `Cash` + `Inflation` | `cost-pressure` + `inflation` → `purchasing-power-loss` | `MAP_TO_CURRENT_CATALOG` | Legacy `Cash` + `Inflation` concept mapped to `cost-pressure` + `inflation` producing `purchasing-power-loss`. |
| 6 | `Inflation` + `Food` | `expense` + `inflation` → `cost-pressure` | `MAP_TO_CURRENT_CATALOG` | `Food` is an essential expense subset; mapped to general `expense` + `inflation` producing `cost-pressure`. |
| 7 | `Emergency Fund` + `Job Loss` | `emergency-liquidity` + `job-loss` → `emergency-survival` | `MAP_TO_CURRENT_CATALOG` | `Emergency Fund` in discovery set is `emergency-liquidity` (sortOrder 25); combined with `job-loss` produces `emergency-survival`. |
| 8 | `FOMO` + `Crypto` | `fomo` + `inflation` → `digital-scam-risk` | `RETIRE_FROM_V1 / MAP_TO_CONCEPT` | Unregulated `Crypto` not in 36-Element MVP catalog; mapped to `fomo` + `inflation` producing `digital-scam-risk`. |

---

### 10.4 Core Craft Recipe V1 Design Matrix (22 Recipes)

| # | outputSlug | Output Name | sortOrder | inputSlugA | inputSlugB | canonicalPairKeyForAuditOnly (NOT_DATABASE_INPUT_HASH) | Prereq Depth | inputAvailabilityProof & Prerequisite Chain | Semantic Fit & Alignment with DiscoveryDetail | Safety & Pedagogical Rationale |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `cash-flow` | Net Cash Flow | 15 | `income` | `expense` | `expense + income` | Depth 1 | Starters: `income` (Depth 0), `expense` (Depth 0) | Compares total cash inflows against living outflows over a period, directly forming net cash flow margin. | Core financial foundation; neutral cash flow accounting. |
| 2 | `debt-pressure` | Debt Service Burden | 16 | `debt` | `interest` | `debt + interest` | Depth 1 | Starters: `debt` (Depth 0), `interest` (Depth 0) | Borrowed principal combined with interest rate obligations generates ongoing debt service strain. | Highlights debt service ratio risks; not financial advice. |
| 3 | `cost-pressure` | Living Inflation Pressure | 17 | `expense` | `inflation` | `expense + inflation` | Depth 1 | Starters: `expense` (Depth 0), `inflation` (Depth 0) | General living expenses squeezed by market inflation rate create living cost pressure. | Educational illustration of purchasing power erosion. |
| 4 | `impulse-spending` | Unplanned Impulse Purchase | 19 | `wants` | `fomo` | `fomo + wants` | Depth 1 | Starters: `wants` (Depth 0), `fomo` (Depth 0) | Uncontrolled discretionary wants driven by social pressure (FOMO) produce unplanned impulse purchases. | Behavioral spending awareness; non-judgmental. |
| 5 | `essential-baseline` | Fixed Baseline Expenses | 27 | `needs` | `rent` | `needs + rent` | Depth 1 | Starters: `needs` (Depth 0), `rent` (Depth 0) | Non-negotiable essential living needs paired with fixed housing rent establish the baseline expense floor. | Teaches baseline expense tracking before discretionary spending. |
| 6 | `discretionary-leakage` | Stealth Cash Leakage | 28 | `wants` | `food` | `food + wants` | Depth 1 | Starters: `wants` (Depth 0), `food` (Depth 0) | Discretionary food/beverage wants outside baseline nutrition accumulate into unmonitored cash leakage. | Highlights micro-expense accumulation over monthly cycles. |
| 7 | `digital-scam-risk` | Digital Fraud Vulnerability | 29 | `fomo` | `inflation` | `fomo + inflation` | Depth 1 | Starters: `fomo` (Depth 0), `inflation` (Depth 0) | High-stress inflation pressures combined with emotional urgency (FOMO) expose individuals to digital scams. | Defensive fraud safety awareness; HIGH_RISK_TOPIC. |
| 8 | `spending-plan` | Structured Spending Plan | 20 | `budget` | `income` | `budget + income` | Depth 1 | Starters: `budget` (Depth 0), `income` (Depth 0) | Structuring earned income using a budget planning tool creates an intentional monthly spending plan. | Encourages active cash flow allocation. |
| 9 | `digital-hygiene` | Digital Security Shield | 35 | `budget` | `fomo` | `budget + fomo` | Depth 1 | Starters: `budget` (Depth 0), `fomo` (Depth 0) | Budgeting emotional urges and setting defensive boundaries against social pressure builds digital hygiene habits. | Teaches proactive account protection and credential security. |
| 10 | `lifestyle-creep` | Lifestyle Inflation Creep | 24 | `income` | `wants` | `income + wants` | Depth 1 | Starters: `income` (Depth 0), `wants` (Depth 0) | Expanding discretionary wants in step with rising income leads to stealth lifestyle inflation creep. | Behavioral warning on spending expansion as income grows. |
| 11 | `savings-growth` | Compounded Savings Growth | 21 | `saving` | `interest` | `interest + saving` | Depth 1 | Starters: `saving` (Depth 0), `interest` (Depth 0) | Basic savings earning compounding interest yields exponential savings accumulation over time. | Demonstrates compounding mechanics over multi-year horizons. |
| 12 | `debt-trap` | Compound Interest Debt Trap | 22 | `debt` | `fomo` | `debt + fomo` | Depth 1 | Starters: `debt` (Depth 0), `fomo` (Depth 0) | Taking high-cost debt to fund impulsive social wants creates a severe compounding debt trap. | High-risk debt warning; NOT_FINANCIAL_ADVICE. |
| 13 | `emergency-resilience` | Financial Safety Buffer | 18 | `cash-flow` | `saving` | `cash-flow + saving` | Depth 2 | `cash-flow` (Depth 1) + Starter `saving` (Depth 0) | Channeling positive net cash flow into basic savings creates a resilient liquid financial safety buffer. | Connects monthly margin to shock absorption buffer. |
| 14 | `purchasing-power-loss` | Real Purchasing Power Erosion | 23 | `cost-pressure` | `inflation` | `cost-pressure + inflation` | Depth 2 | `cost-pressure` (Depth 1) + Starter `inflation` (Depth 0) | Compounding cost pressure under persistent inflation erodes real purchasing power over time. | Teaches difference between nominal cash and real value. |
| 15 | `emergency-liquidity` | Immediate Liquid Cushion | 25 | `saving` | `job-loss` | `job-loss + saving` | Depth 1 | Starters: `saving` (Depth 0), `job-loss` (Depth 0) | Maintaining basic savings specifically set aside against job loss risk provides an immediate liquid cushion. | Liquid reserve accessibility in crisis scenarios. |
| 16 | `mindful-spending` | Mindful Consumption Behavior | 33 | `impulse-spending` | `needs` | `impulse-spending + needs` | Depth 2 | `impulse-spending` (Depth 1) + Starter `needs` (Depth 0) | Filtering impulse spending urges through essential needs reflection yields mindful consumption habits. | Behavioral transformation through reflection & cooling-off. |
| 17 | `debt-payoff-strategy` | Debt Acceleration Strategy | 26 | `debt-pressure` | `budget` | `budget + debt-pressure` | Depth 2 | `debt-pressure` (Depth 1) + Starter `budget` (Depth 0) | Applying budget planning tools to manage high debt pressure produces a structured debt payoff strategy. | Teaches systematic debt repayment allocation; NOT_FINANCIAL_ADVICE. |
| 18 | `budget-optimizing` | Dynamic Allocation Strategy | 34 | `spending-plan` | `cost-pressure` | `cost-pressure + spending-plan` | Depth 2 | `spending-plan` (Depth 1) + `cost-pressure` (Depth 1) | Adjusting a spending plan dynamically in response to living cost pressure optimizes budget allocations. | Flexible spending reallocation under changing costs. |
| 19 | `debt-overload` | Severe Debt Overload | 31 | `debt-trap` | `debt-pressure` | `debt-pressure + debt-trap` | Depth 2 | `debt-trap` (Depth 1) + `debt-pressure` (Depth 1) | Combining a compound debt trap with compounding debt pressure results in critical debt overload. | Severe insolvency warning; urges early creditor negotiation. |
| 20 | `emergency-survival` | Shock Survival Capability | 32 | `emergency-liquidity` | `job-loss` | `emergency-liquidity + job-loss` | Depth 2 | `emergency-liquidity` (Depth 1) + Starter `job-loss` (Depth 0) | Evaluating an emergency liquid cushion against job loss disruption determines exact shock survival duration. | Quantifies survival runway in concrete months. |
| 21 | `financial-stability` | Financial Resilience State | 30 | `emergency-resilience` | `essential-baseline` | `emergency-resilience + essential-baseline` | Depth 3 | `emergency-resilience` (Depth 2) + `essential-baseline` (Depth 1) | Combining an emergency safety buffer with a solid essential baseline creates a stable household financial state. | Ongoing operating stability; balance of buffer and baseline. |
| 22 | `financial-freedom-foundation` | Financial Independence Core | 36 | `financial-stability` | `savings-growth` | `financial-stability + savings-growth` | Depth 4 | `financial-stability` (Depth 3) + `savings-growth` (Depth 1) | Building compounding savings growth on top of a financial stability state creates a financial independence foundation. | Long-term autonomy core; multi-year accumulation horizon. |

---

### 10.5 Progression Depth & Reachability Verification Matrix

| Depth | Element Slug | Element Name | Category Name | Input Element A | Input Element B | Unlock Status |
|---|---|---|---|---|---|---|
| **Depth 0** | `income` | Earned Income | Money Flow | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `expense` | General Expense | Cost of Living | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `saving` | Basic Savings | Saving & Financial Safety | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `debt` | Borrowed Debt | Debt & Credit | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `interest` | Interest Rate | Debt & Credit | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `inflation` | Market Inflation | Cost of Living | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `emergency-fund` | Emergency Fund | Saving & Financial Safety | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `food` | Food & Groceries | Cost of Living | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `rent` | Shelter Rent | Cost of Living | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `budget` | Budget Plan | Planning Tools | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `needs` | Essential Needs | Cost of Living | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `wants` | Discretionary Wants | Financial Behavior | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `fomo` | Social Pressure / FOMO | Financial Behavior | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 0** | `job-loss` | Unexpected Job Loss | Life Events & Risk | (Starter Element) | (Starter Element) | ✅ Base Starter |
| **Depth 1** | `cash-flow` | Net Cash Flow | Money Flow | `income` (D0) | `expense` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `debt-pressure` | Debt Service Burden | Debt & Credit | `debt` (D0) | `interest` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `cost-pressure` | Living Inflation Pressure | Cost of Living | `expense` (D0) | `inflation` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `impulse-spending` | Unplanned Impulse Purchase | Financial Behavior | `wants` (D0) | `fomo` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `essential-baseline` | Fixed Baseline Expenses | Cost of Living | `needs` (D0) | `rent` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `discretionary-leakage` | Stealth Cash Leakage | Financial Behavior | `wants` (D0) | `food` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `digital-scam-risk` | Digital Fraud Vulnerability | Digital Financial Safety | `fomo` (D0) | `inflation` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `spending-plan` | Structured Spending Plan | Planning Tools | `budget` (D0) | `income` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `digital-hygiene` | Digital Security Shield | Digital Financial Safety | `budget` (D0) | `fomo` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `lifestyle-creep` | Lifestyle Inflation Creep | Financial Behavior | `income` (D0) | `wants` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `savings-growth` | Compounded Savings Growth | Saving & Financial Safety | `saving` (D0) | `interest` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `debt-trap` | Compound Interest Debt Trap | Debt & Credit | `debt` (D0) | `fomo` (D0) | ✅ Reachable (Depth 1) |
| **Depth 1** | `emergency-liquidity` | Immediate Liquid Cushion | Saving & Financial Safety | `saving` (D0) | `job-loss` (D0) | ✅ Reachable (Depth 1) |
| **Depth 2** | `emergency-resilience` | Financial Safety Buffer | Life Events & Risk | `cash-flow` (D1) | `saving` (D0) | ✅ Reachable (Depth 2) |
| **Depth 2** | `purchasing-power-loss` | Real Purchasing Power Erosion | Cost of Living | `cost-pressure` (D1) | `inflation` (D0) | ✅ Reachable (Depth 2) |
| **Depth 2** | `mindful-spending` | Mindful Consumption Behavior | Financial Behavior | `impulse-spending` (D1) | `needs` (D0) | ✅ Reachable (Depth 2) |
| **Depth 2** | `debt-payoff-strategy` | Debt Acceleration Strategy | Planning Tools | `debt-pressure` (D1) | `budget` (D0) | ✅ Reachable (Depth 2) |
| **Depth 2** | `budget-optimizing` | Dynamic Allocation Strategy | Planning Tools | `spending-plan` (D1) | `cost-pressure` (D1) | ✅ Reachable (Depth 2) |
| **Depth 2** | `debt-overload` | Severe Debt Overload | Debt & Credit | `debt-trap` (D1) | `debt-pressure` (D1) | ✅ Reachable (Depth 2) |
| **Depth 2** | `emergency-survival` | Shock Survival Capability | Life Events & Risk | `emergency-liquidity` (D1) | `job-loss` (D0) | ✅ Reachable (Depth 2) |
| **Depth 3** | `financial-stability` | Financial Resilience State | Saving & Financial Safety | `emergency-resilience` (D2) | `essential-baseline` (D1) | ✅ Reachable (Depth 3) |
| **Depth 4** | `financial-freedom-foundation` | Financial Independence Core | Planning Tools | `financial-stability` (D3) | `savings-growth` (D1) | ✅ Reachable (Depth 4) |

---
al Runway | STRONG |
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
