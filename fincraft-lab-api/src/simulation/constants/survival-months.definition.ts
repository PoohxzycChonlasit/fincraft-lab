export interface SimulationInputDefinition {
  field: string;
  labelEn: string;
  labelTh: string;
  description: string;
}

export interface SimulationSourceMetadata {
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
}

export interface SurvivalMonthsDefinition {
  slug: string;
  name: string;
  thaiName: string;
  summary: string;
  description: string;
  inputDefinitions: SimulationInputDefinition[];
  formulaExplanation: string;
  calculationVersion: string;
  assumptions: string[];
  limitations: string[];
  sources: SimulationSourceMetadata[];
  disclaimer: string;
}

export const SURVIVAL_MONTHS_DEFINITION: Readonly<SurvivalMonthsDefinition> =
  Object.freeze({
    slug: 'survival-months',
    name: 'Survival Months',
    thaiName: 'จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย',
    summary:
      'Estimates how many months an emergency fund covers essential expenses during job loss.',
    description:
      'Calculates runway in months by dividing total emergency savings by essential monthly living costs.',
    inputDefinitions: [
      {
        field: 'emergencyFund',
        labelEn: 'Emergency Fund',
        labelTh: 'เงินสำรองฉุกเฉิน',
        description: 'Total liquid cash reserved for emergencies.',
      },
      {
        field: 'essentialMonthlyExpenses',
        labelEn: 'Essential Monthly Expenses',
        labelTh: 'ค่าใช้จ่ายจำเป็นต่อเดือน',
        description:
          'Mandatory monthly living costs (food, housing, utilities).',
      },
    ],
    formulaExplanation:
      'survivalMonths = emergencyFund / essentialMonthlyExpenses',
    calculationVersion: 'survival-months-v1',
    assumptions: [
      'Essential monthly expenses remain constant.',
      'No new income is earned during the period.',
      'No investment returns, yields, or interest are included.',
      'No inflation adjustments are applied.',
      'No unexpected extra emergency costs occur.',
      'Both monetary inputs use the same currency unit.',
      'The result is a mathematical estimate, not a forecast.',
    ],
    limitations: [
      'Actual monthly expenses may fluctuate.',
      'Unplanned emergencies can create additional outlays.',
      'Income may resume earlier or later than expected.',
      'Inflation reduces purchasing power over time.',
      'Taxes, debt interest, and asset liquidity are not modeled.',
      'The simulation does not determine if a user is financially safe.',
      'The result is not individualized financial advice.',
    ],
    sources: [
      {
        title: 'An Essential Guide to Building an Emergency Fund',
        publisher: 'Consumer Financial Protection Bureau (CFPB)',
        url: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
        accessedAt: '2026-07-24',
      },
    ],
    disclaimer: 'Education and simulation only. Not financial advice.',
  });
