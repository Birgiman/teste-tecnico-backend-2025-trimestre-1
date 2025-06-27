import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async cacheFile(file: Express.Multer.File) {
    const buffer = await fs.readFile(file.path);
    await this.cache.set(file.filename, buffer, 60);
  }
}
