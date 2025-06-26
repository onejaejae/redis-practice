import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  LIMIT_DEFAULT = 10,
}

export class PaginationRequest {
  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page = PaginationDefault.PAGE_DEFAULT;

  @IsOptional()
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit = PaginationDefault.LIMIT_DEFAULT;

  getHasNext(totalCount: number): boolean {
    return this.page * this.limit < totalCount;
  }
}
