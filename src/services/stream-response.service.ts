import { Request, Response } from 'express';
import { ReadStream } from 'fs';

export class StreamResponseService {
  streamWithRange(
    req: Request,
    res: Response,
    fileSize: number,
    stream: ReadStream,
  ) {
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize,
      });

      stream.pipe(res);
    }
  }
  streamFromBuffer(res: Response, buffer: Buffer) {
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
