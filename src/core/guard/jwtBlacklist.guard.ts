import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../jwt/jwt.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { RequestContextService } from '../cls/cls.service';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';

@Injectable()
export class JwtBlacklistGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly logService: LogService,
    private readonly requestContextService: RequestContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // 토큰 블랙리스트 확인
    const isBlacklisted = await this.jwtService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      const requestId = this.requestContextService.getRequestId();
      await this.logService.createLog(
        LogLevels.ERROR,
        `JwtBlacklistGuard Error: Token: ${token} has been revoked`,
        requestId,
      );
      throw new UnauthorizedException('Token has been revoked');
    }

    return true;
  }
}
