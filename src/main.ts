import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppLogger } from './common/helpers/logger/logger';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { NODE_ENV, PORT } from './config/env.config';
import { GlobalExceptionsFilter } from './common/exceptions/http-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  // app.use(morgan('combined'));
  app.use(compression());
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.enableCors();
  await app.listen(PORT || 3000);
  AppLogger.verbose(
    `Payment Bank started on ${NODE_ENV} environment with port ${PORT}`,
  );
}
bootstrap();
