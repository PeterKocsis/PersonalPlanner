import { Routes } from '@angular/router';
import { TodayComponent } from './navigation-panel/today/today.component';
import { SpaceManagerComponent } from './space-manager/space-manager.component';
import { SpaceViewComponent } from './space-view/space-view.component';
import { SettingsComponent } from './settings/settings.component';
import { InboxComponent } from './inbox/inbox.component';
import { FrameBrowserComponent } from './frame-browser/frame-browser.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { FramePlannerComponent } from './frame-planner/frame-planner.component';

export const routes: Routes = [
  {
    path: '',
    component: TodayComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'today',
    component: TodayComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'manage-spaces',
    component: SpaceManagerComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'spaces/:spaceId',
    component: SpaceViewComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'inbox',
    component: InboxComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'frame-browser',
    component: FrameBrowserComponent,
    
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'frame-planner',
    component: FramePlannerComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },
  {
    path: '**',
    component: LoginComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  }, // Redirect to login for any unknown routes
];
