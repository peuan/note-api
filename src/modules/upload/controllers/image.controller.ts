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

@Controller('images')
@ApiTags('images')
export class ImageController {
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
    console.log(req.hostname);
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
}
