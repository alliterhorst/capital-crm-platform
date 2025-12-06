import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse();
    const traceId = this.cls.getId();

    if (traceId) {
      response.setHeader('x-request-id', traceId);
    }

    return next.handle();
  }
}
