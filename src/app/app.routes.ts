import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'daily', pathMatch: 'full' },
  {
    path: 'daily',
    loadComponent: () => import('./pages/daily/daily').then((m) => m.Daily),
  },
  {
    path: 'library',
    loadComponent: () => import('./pages/library/library').then((m) => m.Library),
  },
  {
    path: 'library/:id',
    loadComponent: () =>
      import('./pages/workout-detail/workout-detail').then((m) => m.WorkoutDetail),
  },
  {
    path: 'rewards',
    loadComponent: () => import('./pages/rewards/rewards').then((m) => m.Rewards),
  },
  {
    path: 'family',
    loadComponent: () => import('./pages/family/family').then((m) => m.Family),
  },
];
