import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/schemas/log/log.schema';
import { LogRepository } from './log.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogRepository],
  exports: [LogRepository],
})
export class LogRepositoryModule {}
