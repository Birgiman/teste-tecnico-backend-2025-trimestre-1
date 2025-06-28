import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StaticService } from './static.service';

@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('video/:filename')
  async streamVideo(
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const stream = await this.staticService.getVideoStream(filename, req, res);
    if (!stream) {
      throw new NotFoundException('Arquivo não encontrado');
    }
  }
}
