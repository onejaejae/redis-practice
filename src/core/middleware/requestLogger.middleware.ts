import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logService: LogService) {}

  private createLog(
    requestId: string,
    message: string,
    method: string,
    url: string,
  ) {
    this.logService.createLog(LogLevels.INFO, message, requestId, {
      method,
      url,
    });
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = req.headers['x-request-id']?.at(0) || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    const { method, originalUrl } = req;

    await this.createLog(
      requestId,
      `Start Request: ${method} ${originalUrl}`,
      method,
      originalUrl,
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
      await this.createLog(
        requestId,
        `Finish Response: ${method} ${url} with status ${statusCode}`,
        method,
        url,
      );
    } catch (error) {
      console.error('Response logging failed:', error);
    }
  }
}
