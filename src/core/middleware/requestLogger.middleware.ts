import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logService: LogService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = req.headers['x-request-id']?.at(0) || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    const { method, originalUrl } = req;

    await this.logService.createLog(
      LogLevels.INFO,
      `Start Request: ${method} ${originalUrl}`,
      requestId,
      {
        method,
        url: originalUrl,
      },
    );

    res.on('finish', async () => {
      await this.logResponse(requestId, method, originalUrl, res.statusCode);
    });

    next();
  }

  private async logResponse(
    requestId: string,
    method: string,
    url: string,
    statusCode: number,
  ): Promise<void> {
    try {
      const level =
        statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
          ? LogLevels.ERROR
          : LogLevels.INFO;

      await this.logService.createLog(
        level,
        `Finish Response: ${method} ${url} with status ${statusCode}`,
        requestId,
        {
          method,
          url,
        },
      );
    } catch (error) {
      console.error('Response logging failed:', error);
    }
  }
}
