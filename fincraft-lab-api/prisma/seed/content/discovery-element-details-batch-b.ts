import { RealityLevel, SafetyLabel } from '../../../src/database/generated/prisma/client';
import { StarterElementDetailSeedInput } from './starter-element-details';

export type DiscoveryElementDetailSeedInput = StarterElementDetailSeedInput;

export const DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA: DiscoveryElementDetailSeedInput[] = [
  {
    elementSlug: 'debt-payoff-strategy',
    shortDescription:
      'A structured framework prioritizing debt repayment order to minimize total interest cost or build momentum.',
    realLesson:
      'Accelerating debt payoff requires prioritizing high-cost borrowing (avalanche) or small balances (snowball) while maintaining minimum payments across all accounts, but suitability depends on interest rates, balances, available cash flow, and borrower discipline.',
    example:
      'A household allocates an extra THB 3,000 monthly surplus directly to their highest-interest 18% personal loan principal while paying minimums on a 5% car loan (educational scenario only; outcomes depend on interest rates, fees, and consistent cash flow).',
    possibleBenefit:
      'Reduces total borrowing costs over time or provides psychological motivation through early debt account wins.',
    possibleTradeoff:
      'Commits extra liquid surplus cash to debt repayment, temporarily reducing monthly savings accumulation.',
    hiddenRisk:
      'Accelerating debt payments without maintaining a basic emergency buffer risks forcing new high-cost borrowing if an unexpected expense occurs.',
    worksWhen:
      'Monthly surplus cash flow is positive, emergency buffers are established, and minimum payments are met on all accounts.',
    becomesDifficultWhen:
      'Unexpected income drops occur, living costs spike, or new borrowing is incurred during the payoff period.',
    whatChangesOutcome:
      'Interest rate differentials, surplus allocation amount, payment consistency, fee structures, and emergency buffer size.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
    sources: [
      {
        title:
          'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
    ],
  },
  {
    elementSlug: 'essential-baseline',
    shortDescription:
      'The non-negotiable fixed minimum monthly outlay required to maintain basic housing, health, nutrition, and mandatory obligations.',
    realLesson:
      'Establishing a clear fixed baseline expense figure sets the mandatory floor for monthly cash flow requirements and determines minimum emergency reserve targets.',
    example:
      'A household calculates its fixed baseline expenses at THB 16,000 monthly for rent, essential groceries, basic utilities, and minimum loan obligations.',
    possibleBenefit:
      'Provides an accurate baseline for budgeting, emergency fund sizing, and risk management.',
    possibleTradeoff:
      'Focuses tightly on mandatory baseline outlays, requiring clear distinction from variable lifestyle wants.',
    hiddenRisk:
      'Underestimating baseline expenses by omitting periodic mandatory bills creates a false sense of financial security.',
    worksWhen:
      'Fixed housing, utility, food, and mandatory debt contracts are accurately tracked and cataloged monthly.',
    becomesDifficultWhen:
      'Utility tariffs rise, essential food prices inflate, or contract terms renew at higher rates.',
    whatChangesOutcome:
      'Household size, housing location, contract terms, essential inflation rate, and mandatory debt service levels.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'แยกให้ปัง... Needs กับ Wants วางแผนเงินอย่างไรไม่ให้รั่วไหล',
        organization: 'Stock Exchange of Thailand',
        url: 'https://www.setinvestnow.com/th/knowledge/article/117-needs-vs-wants',
      },
      {
        title:
          'การสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน (Household Expenditure Survey)',
        organization: 'National Statistical Office Thailand',
        url: 'https://www.nso.go.th',
      },
    ],
  },
  {
    elementSlug: 'discretionary-leakage',
    shortDescription:
      'Small, recurring, unmonitored discretionary expenses that quietly erode monthly surplus cash flow over time.',
    realLesson:
      'Minor daily or weekly micro-purchases feel negligible individually but compound into substantial monthly cash drains when untracked.',
    example:
      'Spending THB 120 daily on unbudgeted premium beverages and convenience snacks totals THB 3,600 monthly (~THB 43,200 annually) of unmonitored cash leakage.',
    possibleBenefit:
      'Tracking micro-expenses exposes stealth cash leakage, instantly reclaiming surplus for savings or debt reduction.',
    possibleTradeoff:
      'Auditing daily spending requires ongoing tracking effort and self-awareness of routine purchasing habits.',
    hiddenRisk:
      'Focusing only on large monthly bills while ignoring daily micro-leakage leaves households wondering why net cash flow remains tight.',
    worksWhen:
      'Individuals log daily micro-purchases and review small recurring spending categories monthly.',
    becomesDifficultWhen:
      'Frictionless digital wallet apps and automated auto-renewing subscriptions hide recurring charges.',
    whatChangesOutcome:
      'Tracking frequency, spending awareness, subscription audits, and impulse purchasing control.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    shortDescription:
      'Susceptibility to financial losses from digital impersonation, deceptive links, or social engineering tactics.',
    realLesson:
      'Digital fraud attempts exploit urgency, fear, or false reward offers to trick individuals into compromising accounts or transferring funds.',
    example:
      'Receiving a fraudulent SMS claiming an urgent bank account suspension containing a fake link requesting personal verification details.',
    possibleBenefit:
      'Developing healthy skepticism and verifying official channels protects financial assets and digital identity.',
    possibleTradeoff:
      'Verifying incoming communications through official channels requires extra time and deliberate caution before acting.',
    hiddenRisk:
      'Assuming digital fraud targets only inexperienced users causes overconfidence, leading to lowered vigilance during high-stress situations.',
    worksWhen:
      'Users verify sender identities via official institutional phone numbers or apps before sharing information or transferring funds.',
    becomesDifficultWhen:
      'Deceptive messages use sophisticated official logos, urgent threat wording, or spoofed caller IDs.',
    whatChangesOutcome:
      'Verification habits, emotional pause before responding, awareness of common scam patterns, and channel verification.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.HIGH_RISK_TOPIC,
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
    shortDescription:
      'A household state where income reliably covers baseline obligations, liquid reserves absorb shocks, and debt burdens are manageable.',
    realLesson:
      'Financial stability represents a balanced ongoing operating state rather than a permanent milestone or moral achievement, requiring continuous maintenance of cash flow and risk buffers.',
    example:
      'A household maintains 4 months of essential expenses in liquid savings, keeps debt obligations under 30% of income, and generates positive monthly cash flow.',
    possibleBenefit:
      'Provides peace of mind, reduces financial anxiety, and creates a solid platform for long-term financial planning.',
    possibleTradeoff:
      'Maintaining stability requires ongoing spending discipline and allocating capital to liquid reserves rather than immediate luxury.',
    hiddenRisk:
      'Viewing financial stability as a permanent guarantee causes households to relax emergency savings discipline after initial success.',
    worksWhen:
      'Monthly cash flow is positive, emergency funds are funded, and debt service ratio stays well below critical stress thresholds.',
    becomesDifficultWhen:
      'Macroeconomic downturns occur, major medical emergencies hit, or primary employment is disrupted.',
    whatChangesOutcome:
      'Savings buffer size, debt service ratio, income stability, spending flexibility, and risk coverage.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title:
          'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
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
    shortDescription:
      'A critical financial condition where mandatory debt service payments absorb a dominant portion of income, threatening baseline living capacity.',
    realLesson:
      'Severe debt overload occurs when debt obligations crowd out essential living needs, requiring urgent debt restructuring, lender negotiation, or professional assistance.',
    example:
      'Allocating THB 22,000 out of THB 28,000 monthly income (78.6%) toward loan repayments, forcing reliance on credit cards for basic food and rent.',
    possibleBenefit:
      'Early recognition of debt overload allows borrowers to seek formal debt clinic counseling or structured bank consolidation before default.',
    possibleTradeoff:
      'Resolving debt overload requires strict lifestyle reduction, suspending new credit, and committing all spare cash flow to debt resolution.',
    hiddenRisk:
      'Attempting to solve debt overload by taking high-cost informal or unverified loans escalates legal and financial risk dramatically.',
    worksWhen:
      'Borrowers contact creditors early, participate in formal debt mediation programs, and freeze additional borrowing.',
    becomesDifficultWhen:
      'Income declines further, multiple aggressive collection actions start, or legal judgments occur.',
    whatChangesOutcome:
      'Debt-to-income ratio, creditor cooperation, access to debt clinics, surplus cash flow, and borrower commitment.',
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
    sources: [
      {
        title:
          'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
        organization: 'Bank of Thailand',
        url: 'https://www.bot.or.th/th/satang-story/satang-school/BOT-teaching-tools.html',
      },
    ],
  },
  {
    elementSlug: 'emergency-survival',
    shortDescription:
      'The estimated duration a household can maintain baseline essential spending using accessible liquid resources during a total income stoppage.',
    realLesson:
      'Emergency survival capability evaluates how long liquid reserves last when divided by baseline essential spending rate during complete income disruption.',
    example:
      'Simplified educational scenario: THB 60,000 in liquid savings divided by THB 15,000 monthly baseline essential spending estimates ~4 months of shock survival, assuming expenses remain fixed and funds are instantly accessible without penalties (educational scenario only; actual duration depends on real-world price changes, unexpected expenses, and account access).',
    possibleBenefit:
      'Quantifies household survival horizon in concrete months, highlighting the adequacy of emergency liquid buffers.',
    possibleTradeoff:
      'Maximizing survival duration requires cutting all discretionary spending immediately upon income loss.',
    hiddenRisk:
      'Including illiquid assets or locked long-term investments in survival calculations creates a false expectation of immediate cash availability.',
    worksWhen:
      'Liquid reserves are principal-protected, immediately accessible, and discretionary spending is halted immediately upon crisis.',
    becomesDifficultWhen:
      'Emergency spending spikes due to medical costs or liquid account access is delayed.',
    whatChangesOutcome:
      'Liquid reserve size, baseline essential spending rate, speed of expense reductions, and account liquidity.',
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title:
          'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
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
    shortDescription:
      'The practice of aligning spending decisions with personal values, budget limits, and long-term priorities rather than emotional impulses.',
    realLesson:
      'Mindful spending introduces intentional reflection before purchases, reducing impulse buying and ensuring discretionary cash flow supports genuine personal well-being.',
    example:
      'Applying a 48-hour cooling-off period to non-essential purchases over THB 1,000, deciding after reflection to save the money for a planned vacation.',
    possibleBenefit:
      'Decreases financial regret, curbs unnecessary lifestyle expansion, and increases satisfaction from intentional purchases.',
    possibleTradeoff:
      'Requires mental discipline, patience, and resisting immediate promotional or social media gratification.',
    hiddenRisk:
      'Confusing mindful spending with extreme frugal deprivation can lead to spending fatigue and sudden compensatory splurging.',
    worksWhen:
      'Individuals define clear personal spending boundaries, enforce cooling-off rules, and review discretionary goals regularly.',
    becomesDifficultWhen:
      'Stress, peer pressure, or aggressive targeted marketing campaigns lower self-control.',
    whatChangesOutcome:
      'Self-awareness, cooling-off habits, clarity of financial values, and impulse resistance.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    shortDescription:
      'Adjusting monthly budget allocations dynamically based on changing cash flow, seasonal costs, and shifting financial goals.',
    realLesson:
      'Dynamic budget optimization adapts spending targets flexibly as income or expense conditions shift, maintaining net cash surplus without abandoning overall financial structure.',
    example:
      'Reallocating THB 2,000 from discretionary entertainment to utility expenses during hot summer months to maintain a fixed 20% savings target.',
    possibleBenefit:
      'Prevents budget failure by allowing planned flexibility for seasonal expenses and unexpected minor cash flow shifts.',
    possibleTradeoff:
      'Requires monthly budget reviews, active cash flow tracking, and making intentional category trade-offs.',
    hiddenRisk:
      'Continually reallocating funds away from savings to cover discretionary overspending undermines long-term growth.',
    worksWhen:
      'Cash flow is tracked regularly, savings targets are protected first, and expense adjustments are made intentionally.',
    becomesDifficultWhen:
      'Income is irregular or baseline fixed costs absorb almost all income, leaving no flexible category margin.',
    whatChangesOutcome:
      'Review frequency, savings protection rules, expense flexibility, and tracking tool effectiveness.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    shortDescription:
      'Proactive security practices and technical controls that protect digital banking accounts, devices, and financial credentials.',
    realLesson:
      'Maintaining strong digital hygiene through robust authentication, software updates, and cautious online habits reduces vulnerability to account compromise and digital fraud.',
    example:
      'Enabling multi-factor or two-step verification where supported on banking applications, using unique passwords, and updating mobile operating systems regularly.',
    possibleBenefit:
      'Strengthens personal account security, prevents unauthorized access, and protects sensitive financial data.',
    possibleTradeoff:
      'Adding authentication steps and managing strong credentials requires extra setup effort and periodic security maintenance.',
    hiddenRisk:
      'Believing that technical controls like multi-factor authentication eliminate all risk can lead to carelessness when evaluating social engineering tactics.',
    worksWhen:
      'Multi-factor verification is enabled where supported, software is kept updated, and credentials are kept private and unique.',
    becomesDifficultWhen:
      'Managing multiple complex credentials causes password fatigue or users disable security features for convenience.',
    whatChangesOutcome:
      'Authentication strength, update regularity, password uniqueness, awareness of social engineering, and security feature usage.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    shortDescription:
      'A long-term financial base combining asset accumulation, minimal debt, and passive cash flow options that expand future lifestyle choices.',
    realLesson:
      'Building a financial independence foundation provides greater flexibility over work and lifestyle choices over multi-year horizons, though suitability and timeline depend on individual income, savings rate, investment performance, and living requirements.',
    example:
      'A worker builds net assets and passive investment income that cover 50% of baseline living costs, enabling the flexibility to transition to part-time work or career retraining (educational scenario only; does not guarantee wealth or early retirement).',
    possibleBenefit:
      'Increases personal autonomy, expands career flexibility, and provides long-term financial resilience.',
    possibleTradeoff:
      'Requires sustained high savings rates, disciplined investment management, and long-term consumption trade-offs over decades.',
    hiddenRisk:
      'Relying on overly optimistic investment return assumptions or ignoring future inflation can cause long-term accumulation plans to fall short.',
    worksWhen:
      'Savings rates are consistent, investment portfolios are diversified, debt is minimized, and compounding horizons are long.',
    becomesDifficultWhen:
      'High inflation erodes asset returns, severe market downturns occur, or living costs expand continuously.',
    whatChangesOutcome:
      'Savings rate percentage, long-term asset returns, inflation rate, debt levels, and lifestyle expense discipline.',
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
    sources: [
      {
        title:
          'สื่อการสอนความรู้ทางการเงินตามกรอบสมรรถนะทางการเงินเพื่อการศึกษาและการเรียนรู้',
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
];
