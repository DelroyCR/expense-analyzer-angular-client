export interface TransactionDto {
  transactionId: string;
  importJobId: string;
  date: string;
  description: string;
  amount: number;
  createdAtUtc: string;
}

export interface TransactionFilter {
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
  importJobId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'Date' | 'Amount';
  sortDirection?: 'asc' | 'desc';
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isPageOutOfRange: boolean;
  message: string | null;
}