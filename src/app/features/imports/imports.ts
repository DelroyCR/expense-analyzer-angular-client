import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api.config';

export interface ImportSummary {
  importedCount: number;
  skippedCount: number;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImportsService {
  constructor(private readonly http: HttpClient) {}

  uploadCsv(file: File): Observable<ImportSummary> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<ImportSummary>(
      `${API_BASE_URL}/api/imports`,
      formData
    );
  }
}