import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheTTL } from 'src/config/constants';
import { VideoStorageService } from 'src/services/video-storage.service';
import { CachedVideoResponse } from 'src/types/cached-video-response.type';

@Injectable()
export class StaticService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly storage: VideoStorageService,
  ) {}

  async getFileBuffer(filename: string): Promise<CachedVideoResponse | false> {
    const exists = await this.storage.exists(filename);
    if (!exists) return false;

    console.log('[GET] Checking cache...');
    const cached = await this.cache.get<string>(filename);
    console.log('[CACHED]', !!cached);

    if (cached) {
      console.log('[REDIS] Cache usado para', filename);
      const buffer = Buffer.from(cached, 'base64');
      return { buffer };
    }

    const buffer = await this.storage.readAsBuffer(filename);
    await this.cache.set(filename, buffer.toString('base64'), CacheTTL.DEFAULT);
    console.log('[REDIS] Cache criado para', filename);

    return { buffer };
  }

  async getFileStream(filename: string): Promise<CachedVideoResponse> {
    const fullPath = await this.storage.getPath(filename);
    const stat = await this.storage.stat(filename);

    return {
      path: fullPath,
      size: stat.size,
    };
  }
}
