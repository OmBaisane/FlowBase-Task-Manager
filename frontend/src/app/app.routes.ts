import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  // Legacy routes (redirect to new)
  { path: 'admin-dashboard', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'user-dashboard', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
