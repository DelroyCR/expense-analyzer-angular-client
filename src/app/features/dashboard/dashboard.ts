import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { CurrentUserResponse } from '../../core/auth/auth.models';
import { MainNav } from '../../shared/components/main-nav/main-nav';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MainNav],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  user = signal<CurrentUserResponse | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.me().subscribe({
      next: user => {
        this.user.set(user);
        this.isLoading.set(false);
      },
      error: () => {
        this.user.set(null);
        this.errorMessage.set('Could not load current user information.');
        this.isLoading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}