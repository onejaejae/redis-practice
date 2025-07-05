import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class RequestContextService {
  constructor(private readonly cls: ClsService) {}

  getRequestId(): string {
    return this.cls.getId();
  }
}
