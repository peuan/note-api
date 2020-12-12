import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: dataBuffer,
          Key: `${uuid()}-${filename}`,
          ACL: 'public-read',
        })
        .promise();

      return {
        url: uploadResult.Location,
        key: uploadResult.Key,
      };
    } catch (e) {
      throw new BadRequestException({
        code: 'image_invalid',
      });
    }
  }

  async uploadPublicFiles(files: Express.Multer.File[]) {
    const s3 = new S3();
    try {
      const uploadFiles = files.map(file => {
        return s3
          .upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Body: file.buffer,
            Key: `${uuid()}-${file.originalname}`,
            ACL: 'public-read',
          })
          .promise();
      });
      const uploadResults = await Promise.all(uploadFiles);
      return uploadResults.map(uploadResult => ({
        url: uploadResult.Location,
        key: uploadResult.Key,
      }));
    } catch (e) {
      throw new BadRequestException({
        code: 'images_invalid',
      });
    }
  }
}
