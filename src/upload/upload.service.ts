import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheTTL } from 'src/config/constants';
import { VideoStorageService } from 'src/services/video-storage.service';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly videoStorage: VideoStorageService,
  ) {}

  async cacheFile(file: Express.Multer.File) {
    try {
      const buffer = await this.videoStorage.save(file);
      await this.cache.set(file.filename, buffer, CacheTTL.DEFAULT);

      const result = await this.cache.get(file.filename);
      console.log(
        `[REDIS] Verificação do cache:`,
        result ? '✔️ Encontrado' : '❌ Não encontrado',
      );
    } catch (err) {
      console.error('[ERROR] Falha ao salvar no cache:', err);
      throw new InternalServerErrorException(
        'Erro ao salvar o arquivo no cache.',
      );
    }
  }
}
