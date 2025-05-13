import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { APIResponse } from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json(
      new APIResponse({
        status: 'error',
        message,
        data: null,
      }),
    );
  }
}
