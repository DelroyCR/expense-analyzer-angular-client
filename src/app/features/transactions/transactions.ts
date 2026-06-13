import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api.config';

import {
  PagedResult,
  TransactionDto,
  TransactionFilter
} from '../../shared/models/transaction.models';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(private readonly http: HttpClient) {}

  getTransactions(filter: TransactionFilter): Observable<PagedResult<TransactionDto>> {
    let params = new HttpParams();

    if (filter.from) {
      params = params.set('From', filter.from);
    }

    if (filter.to) {
      params = params.set('To', filter.to);
    }

    if (filter.minAmount !== undefined && filter.minAmount !== null) {
      params = params.set('MinAmount', String(filter.minAmount));
    }

    if (filter.maxAmount !== undefined && filter.maxAmount !== null) {
      params = params.set('MaxAmount', String(filter.maxAmount));
    }

    if (filter.description) {
      params = params.set('Description', filter.description);
    }

    if (filter.importJobId) {
      params = params.set('ImportJobId', filter.importJobId);
    }

    if (filter.pageNumber !== undefined && filter.pageNumber !== null) {
      params = params.set('PageNumber', String(filter.pageNumber));
    }

    if (filter.pageSize !== undefined && filter.pageSize !== null) {
      params = params.set('PageSize', String(filter.pageSize));
    }

    if (filter.sortBy) {
      params = params.set('SortBy', filter.sortBy);
    }

    if (filter.sortDirection) {
      params = params.set('SortDirection', filter.sortDirection);
    }

    return this.http.get<PagedResult<TransactionDto>>(
      `${API_BASE_URL}/api/Transactions`,
      { params }
    );
  }
}