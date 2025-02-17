import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ErrorMessageResponseFilter } from './common/filters/error-response.filter';

dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorMessageResponseFilter());
  app.enableCors();

  const server = await app.listen(process.env.PORT || 8800);
  const host = server.address().address;
  const port = server.address().port;

  console.log('🌐 Running on :: ', host, ':', port, 'at ');
}
bootstrap();
