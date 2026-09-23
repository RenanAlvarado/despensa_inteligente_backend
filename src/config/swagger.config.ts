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
    .addTag(
      'Usuários',
      'Endpoints para gerenciamento da conta do usuário autenticado.',
    )
    .addTag('Produtos', 'Endpoints para cadastro e gerenciamento de produtos.')
    .addTag('Marcas', 'Endpoints para cadastro e gerenciamento de marcas.')
    .addTag(
      'Categorias',
      'Endpoints para cadastro e gerenciamento de categorias.',
    )
    .addTag('Lotes', 'Endpoints para gerenciamento dos lotes de produtos.')
    .addTag(
      'Movimentações de Lotes',
      'Endpoints para registro e consulta das movimentações dos lotes.',
    )
    .addTag(
      'Listas de Compras',
      'Endpoints para gerenciamento das listas de compras.',
    )
    .addTag(
      'Itens da Lista de Compras',
      'Endpoints para gerenciamento dos produtos presentes nas listas de compras.',
    )
    .addTag('Health', 'Endpoints para verificação da disponibilidade da API.')
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
