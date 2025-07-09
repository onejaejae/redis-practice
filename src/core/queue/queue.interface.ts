import { LogLevels } from 'src/schemas/log/log.interface';
import { Log } from 'src/schemas/log/log.schema';

export const QUEUE_NAMES = {
  LOG_QUEUE: 'log-queue',
} as const;

export const JOB_NAMES = {
  CREATE_LOG: 'create-log',
} as const;

export interface ILogJobData {
  level: LogLevels;
  message: string;
  requestId: string;
  context?: Log['context'];
  error?: Log['error'];
  serviceName: string;
}
