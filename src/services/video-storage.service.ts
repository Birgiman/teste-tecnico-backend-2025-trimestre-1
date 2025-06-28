import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class VideoStorageService {
  private readonly videoDir = path.resolve('./videos');

  private getFullPath(filename: string): string {
    return path.join(this.videoDir, filename);
  }

  async save(file: Express.Multer.File): Promise<Buffer> {
    const buffer = await fs.readFile(file.path);
    return buffer;
  }

  async exists(filename: string): Promise<boolean> {
    const fullPath = this.getFullPath(filename);
    try {
      await fs.access(this.getFullPath(filename));
      return true;
    } catch {
      console.log('[EXISTS] Arquivo não encontrado em:', fullPath);
      return false;
    }
  }

  async getPath(filename: string): Promise<string> {
    const fullPath = this.getFullPath(filename);
    await fs.access(fullPath);
    return fullPath;
  }

  async readAsBuffer(filename: string): Promise<Buffer> {
    const fullPath = this.getFullPath(filename);
    return await fs.readFile(fullPath);
  }
}
