import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config';

@Module({
  controllers: [UserController],
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config.jwt.secret,
      }),
    }),
  ],
})
export class UserModule {}
