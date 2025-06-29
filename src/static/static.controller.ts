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
    const isRangeRequest = Boolean(req.headers.range);

    if (!isRangeRequest) {
      const file = await this.staticService.getFileBuffer(filename);

      if (file.fromCache) {
        console.log(
          '[REDIS] Streaming arquivo diretamente do cache:',
          filename,
        );
        return this.responseService.streamFromBuffer(res, file.buffer);
      }
    }

    const file = await this.staticService.getFileStream(filename);
    if (!file.path || !file.size) {
      throw new NotFoundException('Arquivo não encontrado ou inválido');
    }

    const stream = createReadStream(file.path);
    console.log('[DISK] Streaming arquivo diretamente do disco:', filename);

    return this.responseService.streamWithRange(req, res, file.size, stream);
  }
}
