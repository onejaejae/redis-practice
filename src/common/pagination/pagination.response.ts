import { Expose } from 'class-transformer';
import { PaginationBuilder } from './pagination.builder';

export class PaginationResponse<T> {
  total: number;
  list: Array<T>;
  page: number;
  limit: number;

  constructor(paginationBuilder: PaginationBuilder<T>) {
    this.total = paginationBuilder._total;
    this.list = paginationBuilder._list;
    this.page = paginationBuilder._page;
    this.limit = paginationBuilder._limit;
  }

  @Expose()
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  @Expose()
  get hasNext(): boolean {
    return this.totalPages > this.page;
  }
}
