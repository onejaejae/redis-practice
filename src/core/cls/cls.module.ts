import { Module } from '@nestjs/common';
import { RequestContextService } from './cls.service';
import { ClsModule as NestClsModule } from 'nestjs-cls';

@Module({
  imports: [
    NestClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
      },
    }),
  ],
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class ClsModule {}
