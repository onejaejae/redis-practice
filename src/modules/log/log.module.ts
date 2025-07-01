import { Module } from '@nestjs/common';
import { LogRepositoryModule } from './repository/log-repository.module';
import { LogService } from './log.service';

@Module({
  imports: [LogRepositoryModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
