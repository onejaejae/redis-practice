import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  MongooseModule as MongooseOrmModule,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { MoinConfigService } from 'src/core/config/config.service';

export class MongooseModule {
  private static instance?: DynamicModule;

  static forRoot(): DynamicModule {
    if (!this.instance) {
      this.instance = MongooseOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [MoinConfigService],
        useFactory: async (
          configService: MoinConfigService,
        ): Promise<MongooseModuleOptions> => {
          const mongoConfig = configService.getMongoDBConfig();

          const options: MongooseModuleOptions = {
            uri: mongoConfig.MONGODB_URI,
            dbName: mongoConfig.MONGODB_DATABASE,
            connectionFactory: (connection) => {
              connection.on('connected', () => {
                console.log('MongoDB connected successfully');
              });

              connection.on('error', (error: any) => {
                console.error('MongoDB connection error:', error);
              });

              connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
              });

              // 애플리케이션 종료 시 연결 정리
              process.on('SIGINT', async () => {
                await connection.close();
                console.log(
                  'MongoDB connection closed through app termination',
                );
                process.exit(0);
              });

              return connection;
            },
          };

          return options;
        },
      });
    }

    return this.instance;
  }

  static forFeature(schemas: any[]): DynamicModule {
    return MongooseOrmModule.forFeature(schemas);
  }
}
