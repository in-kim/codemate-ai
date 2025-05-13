import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, APIResponse<T | null>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<APIResponse<T | null>> {
    return next.handle().pipe(
      map((data) =>
        // data가 undefined/null인 경우 처리
        data === undefined || data === null
          ? new APIResponse({
              status: 'success',
              message: 'No content',
              data: null,
            })
          : new APIResponse({
              status: 'success',
              message: 'Request completed successfully.',
              data,
            }),
      ),
    );
  }
}
