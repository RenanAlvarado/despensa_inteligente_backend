import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { AppValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo para api
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new AppValidationPipe());

  app.useGlobalFilters(new DatabaseExceptionFilter());

  // Porta que esta rodando
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
