import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

const File = (fileName = 'file'): MethodDecorator => (
  target: any,
  propertyKey: any,
  descriptor: PropertyDescriptor,
) => {
  return ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};

export const ApiFile = (fileName: string) =>
  applyDecorators(File(fileName), ApiConsumes('multipart/form-data'));
