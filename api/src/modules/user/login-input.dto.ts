import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDto {
  @ApiProperty({ example: 'teste@teste.com' })
  @IsEmail(undefined, {
    message: 'E-mail inválido',
  })
  mail: string;

  @ApiProperty({ example: 'senha' })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Preencha o campo senha' })
  password: string;
}
