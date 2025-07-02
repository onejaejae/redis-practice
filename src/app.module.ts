import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { RequestLoggerMiddleware } from './core/middleware/requestLogger.middleware';

const applicationModules = [UserModule, PostModule];

@Module({
  imports: [CoreModule, ...applicationModules],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
