import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { AuthModule } from './modules/auth/auth.module';

const applicationModules = [UserModule, PostModule, AuthModule];

@Module({
  imports: [CoreModule, ...applicationModules],
})
export class AppModule {}
