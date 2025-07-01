import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { LogLevels } from './log.interface';

export type LogDocument = Log & Document;

@Schema({ timestamps: true, versionKey: false })
export class Log {
  @Prop({
    type: String,
    required: true,
    enum: LogLevels,
  })
  level: LogLevels;

  @Prop({ type: String, required: true })
  message: string;

  // 요청 추적을 위한 필드
  @Prop({ type: String, required: true, index: true })
  requestId: string; // 요청 ID (UUID 형식)

  // 에러 정보를 위한 전용 필드
  @Prop({ type: Object })
  error?: {
    message: string;
    stack: string;
    code?: string;
  };

  @Prop({ type: Object })
  context: {
    method: string;
    url: string;
  };

  static toInstance(log: Partial<Log>): Log {
    return plainToInstance(Log, log);
  }
}

export const LogSchema = SchemaFactory.createForClass(Log);
