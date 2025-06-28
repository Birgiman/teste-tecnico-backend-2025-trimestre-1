import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class VideoStorageService {
  private readonly videoDir = path.resolve('./videos');

  async save(file: Express.Multer.File): Promise<Buffer> {
    const buffer = await fs.readFile(file.path);
    return buffer;
  }

  async exists(filename: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.videoDir, filename));
      return true;
    } catch {
      return false;
    }
  }

  async getPath(filename: string): Promise<string> {
    const fullPath = path.join(this.videoDir, filename);
    await fs.access(fullPath);
    return fullPath;
  }
}
