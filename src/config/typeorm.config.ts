import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as ENV from './env.config';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  entities: [process.cwd() + '/dist/models/*.entity.{js,ts}'],
  synchronize: ENV.DB_TYPEORM_SYNC,
  migrationsRun: ENV.DB_MIGRATION,
  url: ENV.DB_URL,
  extra: {
    ssl: process.env.NODE_ENV === 'production',
  },
  cli: {
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
