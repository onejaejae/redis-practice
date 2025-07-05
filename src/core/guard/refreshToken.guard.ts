import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from 'src/core/logger/logger.service';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';
import { RequestContextService } from '../cls/cls.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly logService: LogService,
    private readonly requestContextService: RequestContextService,
  ) {
    super();
  }

  handleRequest(err: any, user: any, error: Error) {
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    if (!user) throw new UnauthorizedException('invalid token');

    this.loggerService.info(
      this.handleRequest.name,
      `RefreshTokenGuard Success: userId: ${user.sub}`,
    );

    const requestId = this.requestContextService.getRequestId();
    this.logService.createLog(
      LogLevels.INFO,
      `RefreshTokenGuard Success: userId: ${user.sub}`,
      requestId,
    );
    return user;
  }
}
