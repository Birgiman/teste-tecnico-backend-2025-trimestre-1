import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    const cached = await this.cache.get<Buffer>(filename);
    console.log('[CACHED]', !!cached);

    if (cached) {
      console.log('[REDIS] Cache usado para', filename);
      return { buffer: cached };
    }

    const buffer = await this.storage.readAsBuffer(filename);
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      throw new InternalServerErrorException(
        'Arquivo inválido ou corrompido no armazenamento',
      );
    }

    await this.cache.set(filename, buffer, CacheTTL.DEFAULT);

    return { buffer };
  }

  async getFileStream(filename: string): Promise<CachedVideoResponse> {
    const exists = await this.storage.exists(filename);
    if (!exists) {
      throw new Error(`Arquivo não encontrado: ${filename}`);
    }

    const path = await this.storage.getPath(filename);
    const stat = await this.storage.stat(filename);

    return {
      path,
      size: stat.size,
    };
  }

  async cachedFile(filename: string): Promise<void> {
    const buffer = await this.storage.readAsBuffer(filename);
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      console.warn(
        `[REDIS] Não foi possível criar cache para ${filename}: buffer vazio ou inválido. Possível problema durante o upload.`,
      );
      return;
    }
    await this.cache.set(filename, buffer, CacheTTL.DEFAULT);
    console.log('[REDIS] Cache criado para', filename);
  }
}
