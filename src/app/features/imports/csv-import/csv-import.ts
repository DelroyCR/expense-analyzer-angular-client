import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { ImportsService, ImportSummary } from '../imports';
import { AuthService } from '../../../core/auth/auth.service';
import { MainNav } from '../../../shared/components/main-nav/main-nav';

@Component({
  selector: 'app-csv-import',
  standalone: true,
  imports: [CommonModule, MainNav],
  templateUrl: './csv-import.html',
  styleUrl: './csv-import.scss'
})
export class CsvImport {
  selectedFile: File | null = null;
  isUploading = false;
  errorMessage = '';
  successMessage = '';
  summary: ImportSummary | null = null;

  constructor(
    private readonly importsService: ImportsService,
    private readonly authService: AuthService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedFile = input.files?.[0] ?? null;
    this.summary = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  upload(): void {
    const validationError = this.getValidationError();

    if (validationError) {
      this.errorMessage = validationError;
      this.successMessage = '';
      this.summary = null;
      alert(validationError);
      return;
    }

    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.summary = null;

    this.importsService.uploadCsv(this.selectedFile).subscribe({
      next: result => {
        this.summary = result;
        this.isUploading = false;

        const message = `CSV uploaded successfully. Imported rows: ${result.importedCount}. Skipped rows: ${result.skippedCount}.`;

        this.successMessage = message;
        alert(message);
      },
      error: (error: HttpErrorResponse) => {
        this.summary = null;
        this.isUploading = false;
        this.successMessage = '';

        if (error.status === 401) {
          this.authService.logout();

          const message = 'Your session has expired. Please log in again.';

          this.errorMessage = message;
          alert(message);
          return;
        }

        if (error.error?.message) {
          this.errorMessage = error.error.message;
          alert(error.error.message);
          return;
        }

        if (error.error?.title) {
          this.errorMessage = error.error.title;
          alert(error.error.title);
          return;
        }

        const message = 'Could not upload CSV file.';

        this.errorMessage = message;
        alert(message);
      }
    });
  }

  private getValidationError(): string | null {
    if (!this.selectedFile) {
      return 'Please select a CSV file.';
    }

    if (!this.selectedFile.name.toLowerCase().endsWith('.csv')) {
      return 'The selected file must be a CSV file.';
    }

    if (this.selectedFile.size === 0) {
      return 'The selected CSV file is empty.';
    }

    return null;
  }
}