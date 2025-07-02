import { Injectable } from '@nestjs/common';
import { LogRepository } from './repository/log.repository';
import { LogLevels } from 'src/schemas/log/log.interface';
import { Log } from 'src/schemas/log/log.schema';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class LogService {
  constructor(
    private readonly logRepository: LogRepository,
    private loggerService: LoggerService,
  ) {}

  async createLog(
    level: LogLevels,
    message: string,
    requestId: string,
    context: Log['context'],
    error?: Log['error'],
  ): Promise<void> {
    try {
      const logObj = {
        level,
        message,
        requestId,
        context,
        error,
      };
      const logModel = Log.toInstance(logObj);
      await this.logRepository.create(logModel);
    } catch (error) {
      this.loggerService.error(
        this.createLog.name,
        error,
        'Failed to create log',
      );
    }
  }
}
