import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, Max, Min } from 'class-validator';

export class SurvivalMonthsRunRequestDto {
  @ApiProperty({
    example: 25000,
    description:
      'Total liquid cash reserved for emergencies (0 to 100,000,000.00, max 2 decimal places)',
  })
  @IsDefined()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Max(100000000)
  emergencyFund!: number;

  @ApiProperty({
    example: 10000,
    description:
      'Mandatory monthly living costs (0.01 to 100,000,000.00, max 2 decimal places)',
  })
  @IsDefined()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  @Max(100000000)
  essentialMonthlyExpenses!: number;
}
