import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error(
      '⚠️ [GlobalHttpExceptionFilter] Exceção capturada:',
      exception,
    );

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        ...(typeof responseBody === 'string'
          ? { message: responseBody }
          : responseBody),
        timeStamp: new Date().toISOString(),
        path: request.url,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '⚠️ [GlobalHttpExceptionFilter] Erro interno do servidor',
      timeStamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
