import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  TypeOrmModule as OrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as path from 'path';
import { Env } from 'src/core/config';
import { MoinConfigService } from 'src/core/config/config.service';
import { DataSourceOptions, DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';

export class TypeOrmModule {
  private static instance?: DynamicModule;

  static forRoot(): DynamicModule {
    if (!this.instance) {
      initializeTransactionalContext();

      this.instance = OrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [MoinConfigService],
        useFactory: async (
          configService: MoinConfigService,
        ): Promise<TypeOrmModuleOptions> => {
          const dbConfig = configService.getDBConfig();
          const env = configService.getAppConfig().ENV;

          const entitiesPath =
            env === Env.test
              ? path.join(__dirname + './../../../entities/*/*.entity.ts')
              : path.join(__dirname + './../../../entities/*/*.entity.js');

          const options: DataSourceOptions = {
            type: 'mysql',
            host: dbConfig.DB_HOST,
            port: Number(dbConfig.DB_PORT),
            database: dbConfig.DB_DATABASE,
            username: dbConfig.DB_USER_NAME,
            password: dbConfig.DB_PASSWORD,
            entities: [entitiesPath],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: env === Env.test ? true : false,
            logging: false,
          };

          return options;
        },
        async dataSourceFactory(options?: DataSourceOptions) {
          if (!options) throw new Error('Invalid options passed');

          return addTransactionalDataSource(new DataSource(options));
        },
      });
    }

    return this.instance;
  }
}
