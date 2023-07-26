import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'items',
  },
  {
    path: '',
    children: [
      {
        path: 'items',
        loadChildren: () =>
          import('./user/user-list/user-list.routes').then(
            ({ userListRoutes }) => userListRoutes,
          ),
      },
    ],
  },
];
