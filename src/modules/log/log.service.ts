import { Injectable } from '@nestjs/common';
import { LogRepository } from './repository/log.repository';
import { LogLevels } from 'src/schemas/log/log.interface';
import { Log } from 'src/schemas/log/log.schema';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

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
      this.createLog(LogLevels.ERROR, error.message, requestId, context, {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
    }
  }
}
