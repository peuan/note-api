import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  Get,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from '../utils/image.util';
import { ApiFile } from 'src/modules/upload/decorators/api-file.decorator';
import { ApiMultiFile } from 'src/modules/upload/decorators/api-multi-file.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Request, Response } from 'express';
import { ImageService } from '../services/image.service';
import { UploadResponse } from '../classes/upload-response.classes';

@Controller('images')
@ApiTags('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Auth()
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async upload(@UploadedFile() file, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('image_is_required');
    }

    const response = {
      originalname: file.originalname,
      filename: file.filename,
      url: `${req.protocol}://${req.hostname}/images/${file.filename}`,
    };
    return response;
  }

  @Auth()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('images')
  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './files/image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadMultiple(@UploadedFiles() files, @Req() req: Request) {
    if (!files.length) {
      throw new BadRequestException('images_is_required');
    }
    const response = [];
    files.forEach(file => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
        url: `${req.protocol}://${req.hostname}/images/${file.filename}`,
      };
      response.push(fileResponse);
    });
    return response;
  }

  @Get(':filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: './files/image' });
  }

  @Auth()
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @Post('s3/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadToS3(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('image_is_required');
    }
    return await this.imageService.uploadPublicFile(
      file.buffer,
      file.originalname,
    );
  }

  @Auth()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('images')
  @Post('s3/uploads')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadToS3Multiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResponse[]> {
    if (!files.length) {
      throw new BadRequestException('images_is_required');
    }
    return await this.imageService.uploadPublicFiles(files);
  }
}
