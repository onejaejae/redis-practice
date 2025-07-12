import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES, ILogJobData } from '../queue.interface';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class LogProducerService {
  constructor(
    @InjectQueue(QUEUE_NAMES.LOG_QUEUE)
    private logQueue: Queue<ILogJobData>,
    private loggerService: LoggerService,
  ) {}

  async addLogJob(jobData: ILogJobData): Promise<void> {
    try {
      await this.logQueue.add(JOB_NAMES.CREATE_LOG, jobData, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      });

      this.loggerService.info(this.addLogJob.name, jobData, 'Log job added');
    } catch (error) {
      this.loggerService.error(this.addLogJob.name, error, 'Log job failed');
      throw error;
    }
  }
}
