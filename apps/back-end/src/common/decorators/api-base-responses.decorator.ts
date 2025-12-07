import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MESSAGES_HELPER } from '../constants/messages.helper';
import {
  BadRequestResponseDto,
  InternalServerErrorResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '../dto/error.dto';

interface ApiBaseOptions {
  badRequest?: boolean;
  unauthorized?: boolean;
  notFound?: boolean;
  internalError?: boolean;
}

export function ApiBaseAuthResponses(options: ApiBaseOptions = {}): MethodDecorator {
  const { badRequest = true, unauthorized = true, notFound = true, internalError = true } = options;

  const decorators = [];

  if (unauthorized) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: MESSAGES_HELPER.SWAGGER.UNAUTHORIZED,
        type: UnauthorizedResponseDto,
      }),
    );
  }

  if (badRequest) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: MESSAGES_HELPER.SWAGGER.BAD_REQUEST,
        type: BadRequestResponseDto,
      }),
    );
  }

  if (notFound) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: MESSAGES_HELPER.SWAGGER.NOT_FOUND,
        type: NotFoundResponseDto,
      }),
    );
  }

  if (internalError) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: MESSAGES_HELPER.SWAGGER.INTERNAL_SERVER_ERROR,
        type: InternalServerErrorResponseDto,
      }),
    );
  }

  return applyDecorators(...decorators);
}
