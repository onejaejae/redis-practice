import { Injectable } from '@nestjs/common';
import { LogRepository } from './repository/log.repository';
import { LogLevels } from 'src/schemas/log/log.interface';
import { Log } from 'src/schemas/log/log.schema';
import { LoggerService } from 'src/core/logger/logger.service';
import { MoinConfigService } from 'src/core/config/config.service';

@Injectable()
export class LogService {
  private readonly serviceName: string;

  constructor(
    private readonly logRepository: LogRepository,
    private loggerService: LoggerService,
    private configService: MoinConfigService,
  ) {
    this.serviceName = this.configService.getAppConfig().NAME;
  }

  async createLog(
    level: LogLevels,
    message: string,
    requestId: string,
    context?: Log['context'],
    error?: Log['error'],
  ): Promise<void> {
    try {
      const logObj = {
        serviceName: this.serviceName,
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
