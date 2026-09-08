import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { AppValidationPipe } from './common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
  });

  // Prefixo para api
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalFilters(new DatabaseExceptionFilter());

  // Porta da aplicação
  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
