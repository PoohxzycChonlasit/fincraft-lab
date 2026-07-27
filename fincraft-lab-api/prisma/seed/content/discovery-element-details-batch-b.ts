import { RealityLevel, SafetyLabel } from '../../../src/database/generated/prisma/client';
import { StarterElementDetailSeedInput } from './starter-element-details';

export type DiscoveryElementDetailSeedInput = StarterElementDetailSeedInput;

export const DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA: DiscoveryElementDetailSeedInput[] = [
  {
    elementSlug: 'debt-payoff-strategy',
    shortDescription:
      'A structured framework prioritizing debt repayment order to minimize total interest cost or build momentum.',
    realLesson:
      'Accelerating debt payoff requires prioritizing high-cost borrowing (avalanche) or small balances (snowball) while maintaining minimum payments across all accounts.',
    example:
      'Allocating an extra GBP 250 monthly surplus directly to the highest-interest 18% personal loan principal while paying minimums on a 5% car loan.',
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
        title: 'Understanding Credit and Borrowing Costs',
        organization: 'CFPB',
        url: 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Government regulator',
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
      'A household calculates its fixed baseline expenses at GBP 1,400 monthly for rent, essential groceries, basic utilities, and minimum loan obligations.',
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
        title: 'Building Blocks of Financial Capability',
        organization: 'CFPB',
        url: 'https://www.consumerfinance.gov/consumer-tools/financial-well-being/',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Government regulator',
      },
    ],
  },
  {
    elementSlug: 'discretionary-leakage',
    shortDescription:
      'Untracked recurring micro-expenses that quietly drain monthly cash surplus.',
    realLesson:
      'Small unmonitored recurring purchases accumulate into significant annual cash drains, reducing net savings capacity.',
    example: 'Spending GBP 15 daily on unbudgeted takeaway coffee and snacks, draining GBP 450 per month from discretionary surplus.',
    possibleBenefit: 'Identifying cash leaks restores disposable surplus for savings and debt reduction without major lifestyle sacrifice.',
    possibleTradeoff: 'Requires tracking small daily purchases and exercising spending self-control.',
    hiddenRisk: 'Ignoring micro-expenses creates chronic cash tightness despite earning a solid income.',
    worksWhen: 'Daily spending is logged systematically and subscription services are reviewed regularly.',
    becomesDifficultWhen: 'Frictionless digital payment apps make micro-spending effortless and unnoticed.',
    whatChangesOutcome: 'Expense tracking habits, subscription audit frequency, and spending awareness.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'Financial Capability and Behavioral Insights',
        organization: 'World Bank',
        url: 'https://www.worldbank.org/en/topic/financialsector/brief/financial-capability',
        jurisdiction: 'GLOBAL',
        sourceType: 'International organisation',
      },
    ],
  },
  {
    elementSlug: 'digital-scam-risk',
    shortDescription: 'Vulnerability to online financial fraud, phishing, or unauthorized digital transactions.',
    realLesson: 'Digital scams exploit psychological trust or security gaps to fraudulently extract liquid funds or credentials.',
    example: 'Receiving a fake phishing email impersonating a bank asking for urgent account password verification.',
    possibleBenefit: 'Adopting digital security hygiene protects personal financial accounts from unauthorized drain.',
    possibleTradeoff: 'Requires maintaining multi-factor authentication, strong unique passwords, and cautious verification steps.',
    hiddenRisk: 'Falling victim to digital scams can cause instant total loss of liquid checking or savings account balances.',
    worksWhen: 'Two-factor authentication is enabled, account alerts are active, and unsolicited communication is verified.',
    becomesDifficultWhen: 'Sophisticated phishing tactics simulate official communications during stressful moments.',
    whatChangesOutcome: 'Digital security awareness, authentication hygiene, and verification protocols.',
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
    sources: [
      {
        title: 'Spotting and Avoiding Financial Scams',
        organization: 'FTC',
        url: 'https://consumer.ftc.gov/articles/how-to-avoid-a-scam',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Consumer protection agency',
      },
    ],
  },
  {
    elementSlug: 'financial-stability',
    shortDescription: 'A state of overall financial health where cash flow is positive, emergency buffers are intact, and debt is managed.',
    realLesson: 'Financial stability provides long-term peace of mind and resilience, forming the foundation for wealth building.',
    example: 'Maintaining a 6-month emergency reserve, zero high-interest debt, and a positive monthly net cash flow surplus.',
    possibleBenefit: 'Protects household wellbeing against sudden economic recessions or personal health crises.',
    possibleTradeoff: 'Requires sustained discipline, budget control, and prioritizing long-term security over short-term luxuries.',
    hiddenRisk: 'Becoming complacent after reaching stability can lead to lifestyle creep or reduced emergency reserves.',
    worksWhen: 'Cash flow surpluses are maintained, debt is low, and emergency reserves are preserved.',
    becomesDifficultWhen: 'Severe macroeconomic crises hit multiple financial pillars simultaneously.',
    whatChangesOutcome: 'Savings rate, debt levels, emergency fund size, and cash flow margin.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'OECD Recommendation on Financial Literacy',
        organization: 'OECD',
        url: 'https://www.oecd.org/financial/education/',
        jurisdiction: 'GLOBAL',
        sourceType: 'International organisation',
      },
    ],
  },
  {
    elementSlug: 'debt-overload',
    shortDescription: 'A critical financial state where debt service obligations severely exceed monthly repayment capacity.',
    realLesson: 'Severe debt overload threatens household solvency, requiring immediate emergency interventions and debt restructuring.',
    example: 'Monthly debt payments consuming 70% of net monthly income, leaving insufficient cash for basic food and housing.',
    possibleBenefit: 'Forces urgent recognition of insolvency risk, compelling professional debt relief and restructuring actions.',
    possibleTradeoff: 'May require drastic asset liquidations, formal credit restructuring, or long-term credit damage.',
    hiddenRisk: 'Delaying action on debt overload leads to legal garnishments, asset repossession, and bankruptcy.',
    worksWhen: 'Borrowers immediately seek accredited non-profit debt advice and freeze all further credit usage.',
    becomesDifficultWhen: 'High interest compounding accelerates faster than income can be generated.',
    whatChangesOutcome: 'Debt restructuring terms, interest rate relief, lifestyle austerity, and professional guidance.',
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
    sources: [
      {
        title: 'Understanding Credit and Borrowing Costs',
        organization: 'CFPB',
        url: 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Government regulator',
      },
    ],
  },
  {
    elementSlug: 'emergency-survival',
    shortDescription: 'The ability of a household to survive major income loss or emergency shocks using liquid cash buffers.',
    realLesson: 'Emergency survival capability relies directly on the size and accessibility of uncommitted liquid cash reserves.',
    example: 'Surviving a 5-month job layoff smoothly using a dedicated GBP 7,500 emergency savings reserve.',
    possibleBenefit: 'Prevents forced asset sales or high-cost credit debt during major career or health disruptions.',
    possibleTradeoff: 'Requires holding substantial low-yield liquid reserves during normal economic periods.',
    hiddenRisk: 'Exhausting emergency reserves during prolonged crises leaves households vulnerable if another shock follows.',
    worksWhen: 'Reserves cover 3 to 6 months of essential baseline expenses and spending is immediately cut to emergency levels.',
    becomesDifficultWhen: 'Unemployment extends far beyond emergency reserve duration.',
    whatChangesOutcome: 'Reserve duration, speed of spending cuts, availability of unemployment safety nets, and family support.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'An Essential Guide to Building an Emergency Fund',
        organization: 'CFPB',
        url: 'https://www.consumerfinance.gov/about-us/blog/an-essential-guide-to-building-an-emergency-fund/',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Government regulator',
      },
    ],
  },
  {
    elementSlug: 'mindful-spending',
    shortDescription: 'A conscious spending approach where purchases are evaluated intentionally against personal values and budget targets.',
    realLesson: 'Mindful spending aligns daily purchases with personal priorities, preventing impulse buying and lifestyle inflation.',
    example: 'Pausing 24 hours before buying non-essential items to evaluate whether they truly add personal value.',
    possibleBenefit: 'Increases net savings margin while enhancing satisfaction with intentional discretionary spending.',
    possibleTradeoff: 'Requires emotional awareness, self-discipline, and resisting social marketing hype.',
    hiddenRisk: 'Lapses in mindfulness during stressful periods can cause temporary spending spikes.',
    worksWhen: 'Personal values are clearly defined and spending friction is enforced on non-budgeted items.',
    becomesDifficultWhen: 'Constant social media targeted advertising and peer pressure weaken purchase friction.',
    whatChangesOutcome: 'Emotional self-regulation, spending friction rules, personal value clarity, and budgeting discipline.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'Financial Capability and Behavioral Insights',
        organization: 'World Bank',
        url: 'https://www.worldbank.org/en/topic/financialsector/brief/financial-capability',
        jurisdiction: 'GLOBAL',
        sourceType: 'International organisation',
      },
    ],
  },
  {
    elementSlug: 'budget-optimizing',
    shortDescription: 'The active process of refining spending allocations to maximize savings velocity and eliminate wasteful outlays.',
    realLesson: 'Dynamic budget optimization continuously aligns monthly cash flow with changing goals and economic conditions.',
    example: 'Reallocating GBP 150 saved from lower utility tariffs directly into long-term index fund investments.',
    possibleBenefit: 'Accelerates progress toward financial independence by maximizing net cash surplus efficiency.',
    possibleTradeoff: 'Requires monthly budget reviews, expense auditing, and proactive financial management.',
    hiddenRisk: 'Over-optimizing expenses to an extreme level can cause budget fatigue and lifestyle burnout.',
    worksWhen: 'Budgets are reviewed monthly and surplus gains are automatically redirected to priority goals.',
    becomesDifficultWhen: 'Unpredictable variable income creates changing monthly baseline figures.',
    whatChangesOutcome: 'Budget audit frequency, automated transfer rules, financial goal clarity, and spending flexibility.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'Financial Education and Core Competencies for Adults',
        organization: 'OECD',
        url: 'https://www.oecd.org/en/topics/sub-issues/financial-education.html',
        jurisdiction: 'GLOBAL',
        sourceType: 'International organisation',
      },
    ],
  },
  {
    elementSlug: 'digital-hygiene',
    shortDescription: 'Consistent personal security practices protecting online banking, credentials, and financial privacy.',
    realLesson: 'Digital security hygiene forms a critical protective shield around online banking and personal financial assets.',
    example: 'Using a password manager for complex unique passwords and enabling hardware/app-based two-factor authentication.',
    possibleBenefit: 'Prevents unauthorized account takeovers, identity theft, and fraudulent fund drains.',
    possibleTradeoff: 'Requires extra security steps, managing credentials securely, and maintaining security software.',
    hiddenRisk: 'Reusing simple passwords across financial accounts leaves all accounts vulnerable to single-point breaches.',
    worksWhen: 'Unique complex passwords, multi-factor authentication, and transaction alerts are active on all financial accounts.',
    becomesDifficultWhen: 'Frequent credential updates or complex security steps lead to user workarounds or security fatigue.',
    whatChangesOutcome: 'Password uniqueness, multi-factor authentication usage, device security updates, and phishing awareness.',
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
    sources: [
      {
        title: 'Spotting and Avoiding Financial Scams',
        organization: 'FTC',
        url: 'https://consumer.ftc.gov/articles/how-to-avoid-a-scam',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Consumer protection agency',
      },
    ],
  },
  {
    elementSlug: 'financial-freedom-foundation',
    shortDescription: 'The core financial state where passive asset returns cover baseline living expenses, enabling true financial independence.',
    realLesson: 'Financial independence is achieved when invested capital generates sufficient passive yield to support living baseline needs.',
    example: 'Accumulating GBP 400,000 in diversified investments yielding 4% annually (GBP 16,000/year) to cover GBP 15,000 in baseline expenses.',
    possibleBenefit: 'Provides complete career autonomy, financial security, and freedom from mandatory labor reliance.',
    possibleTradeoff: 'Requires long-term disciplined saving, persistent investing, and decades of compound growth.',
    hiddenRisk: 'Overestimating sustainable withdrawal rates or underestimating inflation can deplete capital during retirement.',
    worksWhen: 'Invested capital is diversified across low-cost index assets and withdrawal rates remain conservative (3%–4%).',
    becomesDifficultWhen: 'Severe market downturns occur early in retirement (sequence-of-returns risk) during high inflation.',
    whatChangesOutcome: 'Capital size, asset allocation strategy, safe withdrawal rate, inflation rate, and investment duration.',
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
    sources: [
      {
        title: 'Investor Bulletin: Asset Allocation and Diversification',
        organization: 'SEC',
        url: 'https://www.sec.gov/investor/pubs/assetallocation.htm',
        jurisdiction: 'UNITED_STATES',
        sourceType: 'Government regulator',
      },
    ],
  },
];
