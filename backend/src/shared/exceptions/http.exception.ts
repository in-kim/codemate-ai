import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes, ErrorMessages } from './error-codes';

export class AppHttpException extends HttpException {
  constructor(
    code: ErrorCodes,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ code, message: ErrorMessages[code], status }, status);
  }
}
