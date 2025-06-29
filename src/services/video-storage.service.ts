import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Stats } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { VideoFileWithBuffer } from 'src/types/video-file-metadata.type';

@Injectable()
export class VideoStorageService implements OnModuleInit {
  private readonly videoDir = path.resolve('./videos');

  private getFullPath(filename: string): string {
    return path.join(this.videoDir, filename);
  }

  async onModuleInit() {
    await this.createVideoDir();
  }
  private async createVideoDir() {
    try {
      await fs.mkdir(this.videoDir, { recursive: true });
      console.log(
        '[INIT] Pasta de vídeos criada ou já existente:',
        this.videoDir,
      );
    } catch (err) {
      throw new InternalServerErrorException(
        `[ERRO] Falha ao criar a pasta de vídeos em: ${this.videoDir}`,
        err,
      );
    }
  }

  async save(file: Express.Multer.File): Promise<VideoFileWithBuffer> {
    const buffer = await fs.readFile(file.path);
    return { buffer: buffer };
  }

  async exists(filename: string): Promise<boolean> {
    try {
      await fs.access(this.getFullPath(filename));
      return true;
    } catch {
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
    try {
      return await fs.readFile(fullPath);
    } catch {
      throw new NotFoundException(`Arquivo não encontrado: ${filename}`);
    }
  }

  async stat(filename: string): Promise<Stats> {
    try {
      return await fs.stat(this.getFullPath(filename));
    } catch {
      throw new InternalServerErrorException(
        `Erro ao ler o arquivo: ${filename}`,
      );
    }
  }
}
