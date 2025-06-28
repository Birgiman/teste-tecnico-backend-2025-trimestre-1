import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { VideoStorageService } from './video-storage.service';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly videoStorage: VideoStorageService,
  ) {}

  async cacheFile(file: Express.Multer.File) {
    const buffer = await this.videoStorage.save(file);
    await this.cache.set(file.filename, buffer, 60);
    console.log(`[REDIS] Arquivo ${file.filename} salvo no cache.`);

    const result = await this.cache.get(file.filename);
    console.log(
      `[REDIS] Verificação do cache:`,
      result ? '✔️ Encontrado' : '❌ Não encontrado',
    );
  }
}
