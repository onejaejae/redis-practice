import { PaginationResponse } from './pagination.response';

export class PaginationResponseDto<T> {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasNext: boolean;

  constructor(paginationResponse: PaginationResponse<T>) {
    this.total = paginationResponse.total;
    this.page = paginationResponse.page;
    this.totalPages = paginationResponse.totalPages;
    this.limit = paginationResponse.limit;
    this.hasNext = paginationResponse.hasNext;
  }
}
