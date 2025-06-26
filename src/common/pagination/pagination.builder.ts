import { PaginationResponse } from './pagination.response';

export class PaginationBuilder<T> {
  _list: T[];
  _page: number;
  _limit: number;
  _total: number;

  setData(data: T[]) {
    this._list = data;
    return this;
  }

  setPage(page: number) {
    this._page = page;
    return this;
  }

  setLimit(limit: number) {
    this._limit = limit;
    return this;
  }

  setTotalCount(total: number) {
    this._total = total;
    return this;
  }

  build() {
    return new PaginationResponse(this);
  }
}
