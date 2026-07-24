import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up global OpenAPI document configuration and mounts Swagger UI at /docs and OpenAPI JSON at /docs-json.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('FinCraft Lab API')
    .setDescription(
      'Financial Literacy Discovery Lab backend API. Education and simulation only. Not financial advice.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Enter JWT access token acquired from /auth/login or /auth/register',
      },
      'access-token',
    )
    .addTag('Health', 'System health status and operational telemetry')
    .addTag(
      'Authentication',
      'User registration, login, and identity endpoints',
    )
    .addTag('Elements', 'Financial element discovery and catalog endpoints')
    .addTag(
      'Craft',
      'Financial element combination and concept discovery engine',
    )
    .addTag('Workspaces', 'User workspace lifecycle and metadata management')
    .addTag(
      'Canvas',
      'Workspace graph canvas snapshot load and atomic save endpoints',
    )
    .addTag(
      'Simulations',
      'Financial literacy simulation models and execution engine',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });
}
