import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance, Transform } from 'class-transformer';
import { Document } from 'mongoose';
import { LogLevels } from './log.interface';
import { IsString } from 'class-validator';

export type LogDocument = Log & Document;

class LogError {
  @Prop({
    type: String,
    required: true,
    maxlength: 1000,
    index: true,
  })
  @Transform(({ value }) => value?.substring(0, 1000))
  message: string;

  @Prop({
    type: String,
    maxlength: 10000,
  })
  @Transform(({ value }) => value?.substring(0, 10000))
  stack?: string;

  @Prop({ type: String })
  name?: string;
}

class LogContext {
  @Prop({ type: String, index: true })
  callClass?: string; // 호출된 클래스명

  @Prop({ type: String, index: true })
  callMethod?: string; // 호출된 메서드명

  @Prop({
    type: String,
    required: false,
  })
  method?: string; // HTTP 메서드

  @Prop({
    type: String,
    required: false,
  })
  url?: string; // 요청 URL

  @Prop({ type: Number })
  statusCode?: number; // HTTP 상태 코드

  @Prop({ type: Object })
  body?: any; // 요청 바디

  @Prop({ type: Object })
  query?: Record<string, any>; // 쿼리 파라미터

  @Prop({ type: String })
  @IsString()
  userAgent?: string; // User-Agent

  @Prop({ type: String })
  @IsString()
  ip?: string; // 클라이언트 IP

  @Prop({ type: Number })
  duration?: number; // 요청 처리 시간 (ms)
}

@Schema({ timestamps: true, versionKey: false, collection: 'logs' })
export class Log {
  @Prop({ type: String, required: true, index: true })
  serviceName: string; // 서비스 이름

  @Prop({
    type: String,
    required: true,
    enum: Object.values(LogLevels),
    index: true,
  })
  level: LogLevels;

  @Prop({ type: String, required: true })
  message: string;

  // 요청 추적을 위한 필드
  @Prop({ type: String, required: true, index: true })
  requestId: string; // 요청 ID (UUID 형식)

  // 에러 정보를 위한 전용 필드
  @Prop({ type: LogError })
  error?: LogError;

  @Prop({ type: LogContext })
  context: LogContext;

  static toInstance(log: Partial<Log>): Log {
    return plainToInstance(Log, log);
  }
}

export const LogSchema = SchemaFactory.createForClass(Log);
