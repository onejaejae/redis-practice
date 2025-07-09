import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from './queue.interface';
import { LogConsumerService } from './consumers/log.consumer';
import { LogProducerService } from './producers/log.producer';
import { LogRepositoryModule } from 'src/modules/log/repository/log-repository.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.LOG_QUEUE,
    }),
    LogRepositoryModule,
  ],
  providers: [LogProducerService, LogConsumerService],
  exports: [LogProducerService],
})
export class QueueModule {}
