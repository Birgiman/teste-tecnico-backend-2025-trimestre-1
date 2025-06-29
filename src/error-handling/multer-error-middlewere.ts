import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';
import { MulterError } from 'multer';
import * as path from 'path';
import { FileSizeLimit } from 'src/config/constants';

@Injectable()
export class MulterErrorMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const upload = multer({
      storage: multer.diskStorage({
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
      limits: { fileSize: FileSizeLimit.DEFAULT },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Tipo de arquivo inválido. Apenas vídeos são permitidos.',
            ) as any,
            false,
          );
        }
      },
    }).single('file');

    await upload(req, res, (err: any) => {
      if (err) {
        const MAX_MB = (FileSizeLimit.DEFAULT / (1024 * 1024)).toFixed(0);

        const statusCode = HttpStatus.BAD_REQUEST;
        let message = 'Erro ao processar o arquivo.';

        if (err instanceof MulterError) {
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              message = `Arquivo muito grande. Máximo permitido: ${MAX_MB}MB.`;
              break;
            case 'LIMIT_UNEXPECTED_FILE':
              message = 'Arquivo inesperado.';
              break;
            default:
              console.warn(
                '[MulterErrorMiddleware] Erro não tratado Multer:',
                err.code,
              );
              message = 'Erro ao processar o arquivo enviado!';
              break;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        return res.status(statusCode).json({
          statusCode,
          message,
          timeStamp: new Date().toISOString(),
          path: req.originalUrl,
        });
      }

      next();
    });
  }
}
