import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { createReadStream, statSync } from 'fs';
import * as path from 'path';
import { CacheTTL } from 'src/config/constants';
import { VideoStorageService } from 'src/services/video-storage.service';

@Injectable()
export class StaticService {
  private readonly videoDir = path.resolve('./videos');

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly storage: VideoStorageService,
  ) {}

  async getVideoStream(
    filename: string,
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const filePath = path.join(this.videoDir, filename);
    console.log('[GET]', filename);
    const exists = await this.storage.exists(filename);
    console.log('[EXISTS]', exists);
    if (!exists) return false;

    console.log('[GET] Checking cache...');
    const cached = await this.cache.get<Buffer>(filename);
    console.log('[CACHED]', !!cached);

    if (cached) {
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': cached.length,
      });
      res.end(cached);
      console.log('[REDIS] Cache usado para', filename);
      return true;
    }

    const fileStat = statSync(filePath);
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileStat.size - 1;
      const chunkSize = end - start + 1;

      const file = createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': fileStat.size,
      });
      const file = createReadStream(filePath);
      file.pipe(res);
    }
    const buffer = await this.storage.readAsBuffer(filename);
    await this.cache.set(filename, buffer, CacheTTL.DEFAULT);
    console.log('[REDIS] Cache criado para', filename);

    return true;
  }
}
