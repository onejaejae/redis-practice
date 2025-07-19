import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';
import { Log } from 'src/schemas/log/log.schema';
import { RequestContextService } from '../cls/cls.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly winstonLogger: LoggerService,
    private readonly logService: LogService,
    private readonly requestContextService: RequestContextService,
  ) {}

  private createLog(
    requestId: string,
    message: string,
    context: Log['context'],
  ) {
    this.logService.createLog(LogLevels.INFO, message, requestId, context);
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const requestId = this.requestContextService.getRequestId();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    const { method, originalUrl, body, query, ip } = req;
    const userAgent = req.headers['user-agent'];

    this.winstonLogger.info(`Start Request: ${method} ${originalUrl}`, {
      url: originalUrl,
      method,
      body,
      query,
      ip,
      userAgent,
    });
    await this.createLog(requestId, `Start Request: ${method} ${originalUrl}`, {
      url: originalUrl,
      method,
      body,
      query,
      ip,
      userAgent,
    });

    res.on('finish', async () => {
      const duration = Date.now() - startTime;

      this.winstonLogger.info(
        `Finish Request: ${method} ${originalUrl} with status ${res.statusCode}`,
        {
          method,
          url: originalUrl,
          statusCode: res.statusCode,
          duration,
        },
      );
      await this.createLog(
        requestId,
        `Finish Request: ${method} ${originalUrl} with status ${res.statusCode}`,
        {
          method,
          url: originalUrl,
          statusCode: res.statusCode,
          duration,
        },
      );
    });

    next();
  }
}
