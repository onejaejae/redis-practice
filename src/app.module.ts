import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';

const applicationModules = [];

@Module({
  imports: [CoreModule, ...applicationModules],
})
export class AppModule {}
