import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductQuerystringDto {
  @ApiPropertyOptional({
    description: 'bucas por igualdade no código',
  })
  @IsString()
  @IsOptional()
  readonly barcode: string;

  @ApiPropertyOptional({
    description: 'bucas por igualdade no nome',
  })
  @IsString()
  @IsOptional()
  readonly name: string;
}
