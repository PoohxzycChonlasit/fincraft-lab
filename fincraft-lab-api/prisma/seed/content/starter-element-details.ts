import { RealityLevel, SafetyLabel } from '../../../src/database/generated/prisma/client';

export interface DetailSourceInput {
  title: string;
  organization: string;
  url: string;
}

export interface StarterElementDetailSeedInput {
  elementSlug: string;
  shortDescription: string;
  realLesson: string;
  example: string;
  possibleBenefit: string;
  possibleTradeoff: string;
  hiddenRisk: string;
  worksWhen: string;
  becomesDifficultWhen: string;
  whatChangesOutcome: string;
  realityLevel: RealityLevel;
  safetyLabel: SafetyLabel;
  sources: DetailSourceInput[];
}

export const STARTER_ELEMENT_DETAIL_SEED_DATA: StarterElementDetailSeedInput[] = [
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
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
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
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.SIMULATION_ONLY,
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
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    realityLevel: RealityLevel.GROUNDED,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.NOT_FINANCIAL_ADVICE,
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
    realityLevel: RealityLevel.SIMPLIFIED_MODEL,
    safetyLabel: SafetyLabel.EDUCATION_ONLY,
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
