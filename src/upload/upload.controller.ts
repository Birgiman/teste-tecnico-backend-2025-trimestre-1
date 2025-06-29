import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('video')
  // @UseInterceptors(FileInterceptor('file', ))
  @HttpCode(204)
  async uploadVideo(@Req() req: Request) {
    const file = req.file || (req.files?.[0] as Express.Multer.File);

    if (!file) {
      throw new BadRequestException(
        'Arquivo inválido. Pegamos o erro dentro do controller',
      );
    }

    await this.uploadService.cacheFile(file);
  }
}
