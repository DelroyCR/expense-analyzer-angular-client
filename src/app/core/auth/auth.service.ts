import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';

import {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'expense_analyzer_token';

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, request)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
        })
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${API_BASE_URL}/api/auth/register`,
      request
    );
  }

  me(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(
      `${API_BASE_URL}/api/auth/me`
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    return !!token && token !== 'undefined';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}