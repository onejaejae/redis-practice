import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogService } from 'src/modules/log/log.service';
import { LogLevels } from 'src/schemas/log/log.interface';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  private async createLog(
    context: ExecutionContext,
    err: HttpException,
    statusCode: number,
  ) {
    const requestId = context.switchToHttp().getRequest().headers[
      'x-request-id'
    ];
    const callClass = context.getClass().name;
    const callMethod = context.getHandler().name;
    const method = context.switchToHttp().getRequest().method;
    const url = context.switchToHttp().getRequest().url;
    const body = context.switchToHttp().getRequest().body;
    const query = context.switchToHttp().getRequest().query;

    await this.logService.createLog(
      LogLevels.ERROR,
      `Error: ${method} ${url}, ${callClass}.${callMethod}, ${err.message}`,
      requestId,
      {
        callClass,
        callMethod,
        method,
        url,
        body,
        query,
        statusCode,
      },
      {
        message: err.message,
        stack: err.stack || '',
        name: err.name,
      },
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const returnObj = {
          success: false,
          message: err.message,
        };

        if (err instanceof HttpException) {
          const payload = err.getResponse();
          const statusCode = err.getStatus();
          context.switchToHttp().getResponse().status(statusCode);

          this.createLog(context, err, statusCode);
          return of({
            ...returnObj,
            ...(typeof payload === 'string' ? { message: payload } : payload),
          });
        }

        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        context.switchToHttp().getResponse().status(statusCode);

        this.createLog(context, err, statusCode);
        return of(returnObj);
      }),
    );
  }
}
