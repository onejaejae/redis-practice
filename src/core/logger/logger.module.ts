import { Global, Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { LoggerService } from './logger.service';
import { MoinConfigService } from '../config/config.service';
import { Env } from '../config';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [MoinConfigService],
      useFactory: (configsService: MoinConfigService) => {
        const { ENV, NAME } = configsService.getAppConfig();
        const isDeployedEnv = ENV !== Env.local && ENV !== Env.test;

        if (isDeployedEnv) {
          return {
            transports: [new winston.transports.Console({ level: 'info' })],
          };
        }

        return {
          transports: [
            new winston.transports.Console({
              level: ENV === Env.test ? 'verbose' : 'silly',
              format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                utilities.format.nestLike(NAME, {
                  prettyPrint: true,
                  colors: true,
                }),
              ),
            }),
          ],
        };
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
