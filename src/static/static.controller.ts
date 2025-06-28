import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { StreamResponseService } from 'src/services/stream-response.service';
import { StaticService } from './static.service';

@Controller('static')
export class StaticController {
  constructor(
    private readonly staticService: StaticService,
    private readonly responseService: StreamResponseService,
  ) {}

  @Get('video/:filename')
  async streamVideo(
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const file = await this.staticService.getFileStream(filename);
    if (!file) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    if (file.buffer) {
      this.responseService.streamFromBuffer(res, file.buffer);
    } else {
      const stream = createReadStream(file.path);
      this.responseService.streamWithRange(req, res, file.size, stream);
    }
  }
}
