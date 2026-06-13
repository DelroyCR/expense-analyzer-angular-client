import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { TransactionList } from './features/transactions/transaction-list/transaction-list';
import { CsvImport } from './features/imports/csv-import/csv-import';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: TransactionList,
    canActivate: [authGuard]
  },
  {
    path: 'imports',
    component: CsvImport,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];