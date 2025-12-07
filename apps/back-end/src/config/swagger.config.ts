import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(MESSAGES_HELPER.SWAGGER.TITLE)
    .setDescription(MESSAGES_HELPER.SWAGGER.DESCRIPTION)
    .setVersion(MESSAGES_HELPER.SWAGGER.VERSION)
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(document.paths).forEach((pathItem: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(pathItem).forEach((operation: any) => {
      if (!operation.parameters) {
        operation.parameters = [];
      }
      operation.parameters.push({
        name: MESSAGES_HELPER.SWAGGER.X_REQUEST_ID,
        in: 'header',
        required: false,
        description: MESSAGES_HELPER.SWAGGER.X_REQUEST_ID_DESC,
        schema: {
          type: 'string',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      });
      if (operation.responses) {
        Object.keys(operation.responses).forEach((statusCode: string) => {
          const response = operation.responses[statusCode];
          if (!response.headers) {
            response.headers = {};
          }
          response.headers[MESSAGES_HELPER.SWAGGER.X_REQUEST_ID] = {
            description: MESSAGES_HELPER.SWAGGER.X_REQUEST_ID_DESC,
            schema: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          };
        });
      }
    });
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  try {
    writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  } catch {
    // Fail silently in Cloud environments.
  }
}
