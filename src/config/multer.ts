import { Request } from 'express';
import { diskStorage, FileFilterCallback } from 'multer';
import * as path from 'path';
import { FileSizeLimit } from 'src/config/constants';

export const multerOptions = {
  storage: diskStorage({
    destination: './videos',
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const originalName = file.originalname.replace(/\s+/g, '_');
      const uniqueName = `${path.parse(originalName).name}-${Date.now()}${path.extname(originalName)}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: FileSizeLimit.DEFAULT,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    const isVideo = file.mimetype.startsWith('video/');
    if (!isVideo) {
      cb(new Error('Arquivo não é um vídeo') as unknown as null, false);
    } else {
      cb(null, true);
    }
  },
};
