import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '../config';

export class PrivateGuard implements CanActivate {
  private jwtService: JwtService;
  public constructor() {
    this.jwtService = new JwtService({
      secret: config.jwt.secret,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers?.authorization) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync(
        request.headers.authorization.replace('Bearer ', ''),
      );
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
