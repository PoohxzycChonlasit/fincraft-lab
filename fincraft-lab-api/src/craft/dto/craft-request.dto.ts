import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CraftRequestDto {
  @ApiProperty({
    example: [
      'e1f2a3b4-c5d6-7890-ef12-34567890abcd',
      'f2a3b4c5-d6e7-8901-f234-567890abcdef',
    ],
    description: 'Tuple of exactly 2 unique input element UUID v4s to combine',
    type: [String],
    minItems: 2,
    maxItems: 2,
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  inputElementIds!: string[];
}
