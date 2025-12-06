import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MESSAGES_HELPER } from '../constants/messages.helper';

export function ApiBaseAuthResponses(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: MESSAGES_HELPER.SWAGGER.UNAUTHORIZED,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: MESSAGES_HELPER.SWAGGER.BAD_REQUEST,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: MESSAGES_HELPER.SWAGGER.INTERNAL_SERVER_ERROR,
    }),
  );
}
