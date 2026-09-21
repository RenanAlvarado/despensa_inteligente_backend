import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, port: number): void {
  const config = new DocumentBuilder()
    .setTitle('Despensa Inteligente API')
    .setDescription(
      `
    API para gerenciamento de estoque e controle do giro de alimentos.

    ### Autenticação

    Os endpoints protegidos utilizam autenticação via JWT.
    O token deve ser enviado no header HTTP Authorization utilizando o esquema Bearer.

    Exemplo:
    Authorization: Bearer <token>
  `,
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
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.log(`Swagger: http://localhost:${port}/api/docs`);
}
