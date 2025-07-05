import { ClassProvider, Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './interceptor/apiResponse.interceptor';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { TypeOrmModule } from './database/typeorm/typeorm.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
import { MongooseModule } from './database/mongoose/mongoose.module';
import { LogModule } from 'src/modules/log/log.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtBlacklistGuard } from './guard/jwtBlacklist.guard';
import { AccessTokenGuard } from './guard/accessToken.guard';

const modules = [ConfigModule, LoggerModule, CacheModule, LogModule, JwtModule];
const providers: ClassProvider[] = [];
const interceptors: ClassProvider[] = [
  { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
];
const guards: ClassProvider[] = [
  {
    provide: APP_GUARD,
    useClass: JwtBlacklistGuard,
  },
  {
    provide: APP_GUARD,
    useClass: AccessTokenGuard,
  },
];
const filters: ClassProvider[] = [];

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(), MongooseModule.forRoot(), ...modules],
  providers: [...providers, ...interceptors, ...filters, ...guards],
  exports: [...modules, ...providers],
})
export class CoreModule {}
