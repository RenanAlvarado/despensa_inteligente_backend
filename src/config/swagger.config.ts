import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, port: number): void {
  const config = new DocumentBuilder()
    .setTitle('Despensa Inteligente API')
    .setDescription(
      'API para gerenciamento de estoque e controle do giro de alimentos.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(
      'Autenticação',
      'Endpoints de autenticação e gerenciamento de acesso.',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  console.log(`Swagger: http://localhost:${port}/api/docs`);
}
