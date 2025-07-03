import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectDetailsLmComponent } from './components/project-details-lm/project-details-lm.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard]
  },
  {
    path: 'project/new',
    component: ProjectCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'project/:id',
    component: ProjectDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'project/:id/lm',
    component: ProjectDetailsLmComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
