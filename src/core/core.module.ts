import { ClassProvider, Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './interceptor/apiResponse.interceptor';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { TypeOrmModule } from './database/typeorm/typeorm.module';
import { LoggerModule } from './logger/logger.module';

const modules = [ConfigModule, LoggerModule];
const providers: ClassProvider[] = [];
const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
];
const filters: ClassProvider[] = [];

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(), ...modules],
  providers: [...providers, ...interceptors, ...filters],
  exports: [...modules, ...providers],
})
export class CoreModule {}
