export type SimulationSummary = {
  id: string;
  slug: string;
  name: string;
  thaiName: string;
  summary: string;
  isActive: boolean;
};

export type SimulationSourceMetadata = {
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
};

export type SimulationDetail = SimulationSummary & {
  description: string;
  formulaExplanation: string;
  assumptions: string[];
  limitations: string[];
  sources: SimulationSourceMetadata[];
  disclaimer: string;
  calculationVersion: string;
};

export type SurvivalMonthsInput = {
  emergencyFund: number;
  essentialMonthlyExpenses: number;
};

export type SimulationRunResult = {
  runId: string;
  simulation: {
    id: string;
    slug: string;
    name: string;
  };
  input: {
    emergencyFund: string;
    essentialMonthlyExpenses: string;
  };
  result: {
    survivalMonths: string;
    wholeMonthsCovered: number;
    remainingAmount: string;
    statementEn: string;
    statementTh: string;
  };
  assumptions: string[];
  limitations: string[];
  sources: SimulationSourceMetadata[];
  disclaimer: string;
  calculationVersion: string;
  createdAt: string;
};
