import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UserModule } from './modules/user/user.module';

const applicationModules = [UserModule];

@Module({
  imports: [CoreModule, ...applicationModules],
})
export class AppModule {}
