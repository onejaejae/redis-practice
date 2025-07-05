import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from 'src/core/jwt/jwt.service';
import { LoggerService } from 'src/core/logger/logger.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { RequestContextService } from '../cls/cls.service';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt-access') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
    private readonly logService: LogService,
    private readonly requestContextService: RequestContextService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err) throw new UnauthorizedException(err.message);
    if (!user) throw new UnauthorizedException('invalid token');

    this.loggerService.info(
      this.handleRequest.name,
      `AccessTokenGuard Success: userId: ${user.id}`,
    );

    const requestId = this.requestContextService.getRequestId();
    this.logService.createLog(
      LogLevels.INFO,
      `AccessTokenGuard Success: userId: ${user.id}`,
      requestId,
    );
    return user;
  }
}
