import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiErrorResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
        },
      },
    }),
  );
};

