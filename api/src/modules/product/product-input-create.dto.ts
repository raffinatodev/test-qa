import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Length, Max, Min } from 'class-validator';

export class ProductInputCreateDto {
  @ApiProperty()
  @Length(3, 20, {
    message: 'O nome deve conter de 3 a 20 caracteres',
  })
  name: string;

  @ApiProperty({ type: Number, maximum: 5 })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Preço inválido',
    },
  )
  @Max(999.99, {
    message: 'O preço deve ter o valor máximo de 999.99',
  })
  @Min(0.01, {
    message: 'O preço não poder ter valor menor que 0.01',
  })
  price: number;

  @ApiProperty({
    type: Number,
    minimum: 3,
    maximum: 8,
    example: '12345678',
    description: 'campo unico',
  })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    {
      message: 'Código de barra inválido',
    },
  )
  @Max(999999, {
    message: 'O código de barras deve conter no maximo 6 caracteres',
  })
  barcode: number;
}
