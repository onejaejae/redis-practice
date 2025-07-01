import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from 'src/schemas/log/log.schema';

@Injectable()
export class LogRepository {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(model: Log): Promise<Log> {
    const createdLog = await this.logModel.create(model);
    return createdLog.save();
  }
}
