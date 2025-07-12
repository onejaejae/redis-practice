import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from './queue.interface';
import { LogConsumerService } from './consumers/log.consumer';
import { LogProducerService } from './producers/log.producer';
import { LogRepositoryModule } from 'src/modules/log/repository/log-repository.module';
import { ConfigModule } from '../config/config.module';
import { MoinConfigService } from '../config/config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: MoinConfigService) => ({
        connection: {
          host: configService.getRedisConfig().HOST,
          port: Number(configService.getRedisConfig().PORT),
        },
      }),
      inject: [MoinConfigService],
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
