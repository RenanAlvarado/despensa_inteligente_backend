import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestTimingInterceptor } from './common/interceptors/request-timing.interceptor';
import { AppValidationPipe } from './common/pipes/validation.pipe';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Helmet
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
  });

  // Prefixo para api
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalFilters(
    new DatabaseExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new RequestTimingInterceptor());

  // Porta da aplicação
  const port = configService.getOrThrow<number>('PORT');

  // Swagger
  setupSwagger(app, port);

  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
