import { Injectable } from '@nestjs/common';
import type { SurvivalMonthsRunRequestDto } from './dto/survival-months-run-request.dto';
import type {
  SurvivalMonthsInputSnapshotDto,
  SurvivalMonthsResultDto,
} from './dto/simulation-response.dto';

export interface CalculatedSurvivalMonthsOutput {
  normalizedInput: SurvivalMonthsInputSnapshotDto;
  result: SurvivalMonthsResultDto;
}

@Injectable()
export class SimulationCalculatorService {
  /**
   * Deterministic calculation using BigInt minor-unit arithmetic (1 unit = 100 minor units)
   * and ROUND_HALF_UP rounding for 2 decimal places.
   */
  calculateSurvivalMonths(
    dto: SurvivalMonthsRunRequestDto,
  ): CalculatedSurvivalMonthsOutput {
    const fundMinor = BigInt(Math.round(dto.emergencyFund * 100));
    const expenseMinor = BigInt(Math.round(dto.essentialMonthlyExpenses * 100));

    const wholeMonthsBigInt = fundMinor / expenseMinor;
    const wholeMonthsCovered = Number(wholeMonthsBigInt);

    const remainingMinor = fundMinor - wholeMonthsBigInt * expenseMinor;
    const remainingAmount = (Number(remainingMinor) / 100).toFixed(2);

    const quotient = (fundMinor * 100n) / expenseMinor;
    const remainder = (fundMinor * 100n) % expenseMinor;
    const roundUp = remainder * 2n >= expenseMinor;
    const survivalHundredths = quotient + (roundUp ? 1n : 0n);
    const survivalMonths = (Number(survivalHundredths) / 100).toFixed(2);

    const emergencyFundStr = (Number(fundMinor) / 100).toFixed(2);
    const essentialMonthlyExpensesStr = (Number(expenseMinor) / 100).toFixed(2);

    const statementEn = `Under the entered values and stated assumptions, the emergency fund covers approximately ${survivalMonths} months of essential monthly expenses.`;
    const statementTh = `ภายใต้ตัวเลขและสมมติฐานที่กรอก เงินสำรองรองรับค่าใช้จ่ายจำเป็นได้ประมาณ ${survivalMonths} เดือน`;

    return {
      normalizedInput: {
        emergencyFund: emergencyFundStr,
        essentialMonthlyExpenses: essentialMonthlyExpensesStr,
      },
      result: {
        survivalMonths,
        wholeMonthsCovered,
        remainingAmount,
        statementEn,
        statementTh,
      },
    };
  }
}
