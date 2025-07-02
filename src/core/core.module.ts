import { ClassProvider, Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './interceptor/apiResponse.interceptor';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { TypeOrmModule } from './database/typeorm/typeorm.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
import { MongooseModule } from './database/mongoose/mongoose.module';
import { LogModule } from 'src/modules/log/log.module';

const modules = [ConfigModule, LoggerModule, CacheModule, LogModule];
const providers: ClassProvider[] = [];
const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
];
const filters: ClassProvider[] = [];

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(), MongooseModule.forRoot(), ...modules],
  providers: [...providers, ...interceptors, ...filters],
  exports: [...modules, ...providers],
})
export class CoreModule {}
