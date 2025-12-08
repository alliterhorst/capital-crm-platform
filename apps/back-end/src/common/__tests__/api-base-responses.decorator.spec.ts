import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiBaseAuthResponses } from '../decorators/api-base-responses.decorator';
import {
  BadRequestResponseDto,
  InternalServerErrorResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '../dto/error.dto';
import { MESSAGES_HELPER } from '../constants/messages.helper';

jest.mock('@nestjs/swagger', () => ({
  ApiResponse: jest.fn(() => () => ({})),
  ApiProperty: jest.fn(() => () => ({})),
}));

describe('ApiBaseAuthResponses', () => {
  beforeEach(() => {
    (ApiResponse as jest.Mock).mockClear();
  });

  it('should apply all responses by default', () => {
    ApiBaseAuthResponses();

    expect(ApiResponse).toHaveBeenCalledWith({
      status: HttpStatus.UNAUTHORIZED,
      description: MESSAGES_HELPER.SWAGGER.UNAUTHORIZED,
      type: UnauthorizedResponseDto,
    });
    expect(ApiResponse).toHaveBeenCalledWith({
      status: HttpStatus.BAD_REQUEST,
      description: MESSAGES_HELPER.SWAGGER.BAD_REQUEST,
      type: BadRequestResponseDto,
    });
    expect(ApiResponse).toHaveBeenCalledWith({
      status: HttpStatus.NOT_FOUND,
      description: MESSAGES_HELPER.SWAGGER.NOT_FOUND,
      type: NotFoundResponseDto,
    });
    expect(ApiResponse).toHaveBeenCalledWith({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: MESSAGES_HELPER.SWAGGER.INTERNAL_SERVER_ERROR,
      type: InternalServerErrorResponseDto,
    });
  });

  it('should disable specific responses when options provided', () => {
    ApiBaseAuthResponses({ badRequest: false, internalError: false });

    expect(ApiResponse).toHaveBeenCalledTimes(2);
    expect(ApiResponse).toHaveBeenCalledWith({
      status: HttpStatus.UNAUTHORIZED,
      description: MESSAGES_HELPER.SWAGGER.UNAUTHORIZED,
      type: UnauthorizedResponseDto,
    });
    expect(ApiResponse).toHaveBeenCalledWith({
      status: HttpStatus.NOT_FOUND,
      description: MESSAGES_HELPER.SWAGGER.NOT_FOUND,
      type: NotFoundResponseDto,
    });
  });
});
