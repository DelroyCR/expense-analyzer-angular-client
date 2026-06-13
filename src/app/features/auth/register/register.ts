import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (raw.password !== raw.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.successMessage = '';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      email: raw.email,
      password: raw.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully. Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.successMessage = '';

        if (error.error?.message) {
          this.errorMessage = error.error.message;
          return;
        }

        if (error.error?.title) {
          this.errorMessage = error.error.title;
          return;
        }

        this.errorMessage = 'Could not create account.';
      }
    });
  }
}