import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto } from './login-input.dto';
import { LoginResponseDto } from '../../../src/modules/user/login-response.dto';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@config/config';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: config.jwt.secret,
          signOptions: { expiresIn: config.jwt.expiresIn },
        }),
      ],
      controllers: [UserController],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve acessar com credenciais válidas', async () => {
    const validCredentials: LoginInputDto = {
      mail: 'qa@raffinato.com',
      password: 'test-qa',
    };

    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(validCredentials)
      .expect(200);

    const loginResponse: LoginResponseDto = response.body;

    expect(loginResponse).toHaveProperty('token');
    expect(loginResponse).toHaveProperty('user');
    expect(loginResponse.user.mail).toBe(validCredentials.mail);
    expect(loginResponse.user.name).toBe('Raffinato QA');

    const decodedToken = jwtService.verify(loginResponse.token);
    expect(decodedToken.mail).toBe(validCredentials.mail);
  });
});