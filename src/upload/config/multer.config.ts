import { Request } from 'express';
import { diskStorage, FileFilterCallback } from 'multer';
import { extname } from 'path';
import { FileSizeLimit } from 'src/config/constants';

export const multerOptions = {
  storage: diskStorage({
    destination: './videos',
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueName = `${Date.now()}${extname(file.originalname)}`;
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
