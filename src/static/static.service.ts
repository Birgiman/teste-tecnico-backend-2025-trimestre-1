import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  private async getDiskMetadata(filename: string) {
    const path = await this.storage.getPath(filename);
    const stat = await this.storage.stat(filename);

    return { path, size: stat.size };
  }

  private async ensureCache(filename: string): Promise<CachedVideoResponse> {
    console.log('[GET] Checking cache...');
    const cached = await this.cache.get<Buffer>(filename);
    console.log('[CACHED]', !!cached);

    if (cached) {
      console.log('[REDIS] Cache usado para', filename);
      return { buffer: cached, fromCache: true };
    }

    const buffer = await this.storage.readAsBuffer(filename);
    await this.cache.set(filename, buffer, CacheTTL.DEFAULT);
    console.log('[REDIS] Cache criado para', filename);

    const { path, size } = await this.getDiskMetadata(filename);

    return { path, size, fromCache: false };
  }

  async getFileBuffer(filename: string): Promise<CachedVideoResponse> {
    const exists = await this.storage.exists(filename);
    if (!exists) {
      throw new NotFoundException(`Arquivo não encontrado: ${filename}`);
    }
    return this.ensureCache(filename);
  }

  async getFileStream(filename: string): Promise<CachedVideoResponse> {
    const exists = await this.storage.exists(filename);
    if (!exists) {
      throw new NotFoundException(`Arquivo não encontrado: ${filename}`);
    }

    try {
      const { path, size } = await this.getDiskMetadata(filename);

      return { path, size };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao acessar o arquivo para streaming',
      );
    }
  }
}
