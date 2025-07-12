import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LogRepository } from 'src/modules/log/repository/log.repository';
import { ILogJobData, JOB_NAMES, QUEUE_NAMES } from '../queue.interface';
import { Log } from 'src/schemas/log/log.schema';
import { LoggerService } from 'src/core/logger/logger.service';

@Processor(QUEUE_NAMES.LOG_QUEUE)
export class LogConsumerService extends WorkerHost {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly loggerService: LoggerService,
  ) {
    super();
  }

  async process(job: Job<ILogJobData>): Promise<void> {
    try {
      this.loggerService.info(this.process.name, job, 'Log job consumed');

      switch (job.name) {
        case JOB_NAMES.CREATE_LOG:
          if (!job.data) {
            this.loggerService.error(
              this.process.name,
              'job.data is undefined',
            );
            return;
          }

          await this.handleCreateLog(job.data);
          break;
      }
    } catch (error) {
      this.loggerService.error(
        this.process.name,
        error,
        'Failed to process log job',
      );
      throw error; // 재시도를 위해 에러 전파
    }
  }

  private async handleCreateLog(data: ILogJobData): Promise<void> {
    const logModel = Log.toInstance(data);
    await this.logRepository.create(logModel);

    this.loggerService.info(
      this.handleCreateLog.name,
      logModel,
      'Log job created successfully',
    );
  }
}
