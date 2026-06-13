import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TransactionsService } from '../transactions';
import { TransactionDto, TransactionFilter } from '../../../shared/models/transaction.models';
import { AuthService } from '../../../core/auth/auth.service';
import { MainNav } from '../../../shared/components/main-nav/main-nav';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainNav],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  transactions = signal<TransactionDto[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  pageNumber = signal(1);
  pageSize = 20;
  totalCount = signal(0);
  totalPages = signal(0);

  filterForm = new FormGroup({
    from: new FormControl('', { nonNullable: true }),
    to: new FormControl('', { nonNullable: true }),
    minAmount: new FormControl<number | null>(null),
    maxAmount: new FormControl<number | null>(null),
    description: new FormControl('', { nonNullable: true }),
    importJobId: new FormControl('', { nonNullable: true }),
    sortBy: new FormControl<'' | 'Date' | 'Amount'>('', { nonNullable: true }),
    sortDirection: new FormControl<'' | 'asc' | 'desc'>('', { nonNullable: true })
  });

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const validationError = this.getValidationError();

    if (validationError) {
      this.isLoading.set(false);
      this.clearResults();
      this.errorMessage.set(validationError);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.clearResults();

    const filter = this.buildFilter();

    this.transactionsService.getTransactions(filter).subscribe({
      next: result => {
        this.transactions.set(result.items ?? []);
        this.totalCount.set(result.totalCount ?? 0);
        this.totalPages.set(result.totalPages ?? 0);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.clearResults();

        if (error.status === 401) {
          this.authService.logout();
          this.errorMessage.set('Your session has expired. Please log in again.');
          this.isLoading.set(false);
          return;
        }

        if (error.error?.message) {
          this.errorMessage.set(error.error.message);
          this.isLoading.set(false);
          return;
        }

        this.errorMessage.set('Could not load transactions.');
        this.isLoading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.pageNumber.set(1);
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filterForm.reset({
      from: '',
      to: '',
      minAmount: null,
      maxAmount: null,
      description: '',
      importJobId: '',
      sortBy: '',
      sortDirection: ''
    });

    this.pageNumber.set(1);
    this.loadTransactions();
  }

  hasPreviousPage(): boolean {
    return this.pageNumber() > 1;
  }

  hasNextPage(): boolean {
    return this.pageNumber() < this.totalPages();
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    this.pageNumber.update(current => current - 1);
    this.loadTransactions();
  }

  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    this.pageNumber.update(current => current + 1);
    this.loadTransactions();
  }

  private buildFilter(): TransactionFilter {
    const raw = this.filterForm.getRawValue();
    const sortBy = raw.sortBy || undefined;
    const sortDirection = sortBy ? raw.sortDirection || undefined : undefined;

    return {
      from: this.toUtcStartOfDay(raw.from),
      to: this.toUtcEndOfDay(raw.to),
      minAmount: raw.minAmount ?? undefined,
      maxAmount: raw.maxAmount ?? undefined,
      description: raw.description.trim() || undefined,
      importJobId: raw.importJobId.trim() || undefined,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      sortBy,
      sortDirection
    };
  }

  private toUtcStartOfDay(dateValue: string): string | undefined {
    if (!dateValue) {
      return undefined;
    }

    return `${dateValue}T00:00:00.000Z`;
  }

  private toUtcEndOfDay(dateValue: string): string | undefined {
    if (!dateValue) {
      return undefined;
    }

    return `${dateValue}T23:59:59.999Z`;
  }

  private getValidationError(): string | null {
    const raw = this.filterForm.getRawValue();

    if (raw.minAmount !== null && raw.minAmount < 0) {
      return 'The minimum amount cannot be negative.';
    }

    if (raw.maxAmount !== null && raw.maxAmount < 0) {
      return 'The maximum amount cannot be negative.';
    }

    if (raw.from && raw.to) {
      const fromDate = new Date(raw.from);
      const toDate = new Date(raw.to);

      if (fromDate > toDate) {
        return 'From date cannot be greater than To date.';
      }
    }

    if (raw.minAmount !== null && raw.maxAmount !== null) {
      if (raw.minAmount > raw.maxAmount) {
        return 'MinAmount cannot be greater than MaxAmount.';
      }
    }

    return null;
  }

  private clearResults(): void {
    this.transactions.set([]);
    this.totalCount.set(0);
    this.totalPages.set(0);
  }
}