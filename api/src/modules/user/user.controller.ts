import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponseDto } from './login-response.dto';
import { LoginInputDto } from './login-input.dto';
import { delayRequest } from '../common/dalay-request';
import { faker } from '@faker-js/faker';
import { config } from '../config';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  public constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiResponse({
    type: LoginResponseDto,
    status: HttpStatus.OK,
  })
  public async login(@Body() input: LoginInputDto): Promise<LoginResponseDto> {
    return delayRequest(async () => {
      if (input.mail !== 'qa@raffinato.com' || input.password !== 'test-qa') {
        throw new UnauthorizedException('Usuário ou senha inválido');
      }

      const user = {
        id: faker.datatype.uuid (),
        mail: input.mail,
        name: 'Raffinato QA',
      };

      const token = await this.jwtService.signAsync(user, {
        expiresIn: config.jwt.expiresIn,
      });

      return {
        user,
        token,
      };
    });
  }
}
