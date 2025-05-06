import { Routes } from '@angular/router';
import { TodayComponent } from './navigation-panel/today/today.component';
import { SpaceManagerComponent } from './space-manager/space-manager.component';
import { SpaceViewComponent } from './space-view/space-view.component';
import { SettingsComponent } from './settings/settings.component';
import { InboxComponent } from './inbox/inbox.component';
import { PlannerComponent } from './planner/planner.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', component: TodayComponent },
  { path: 'today', component: TodayComponent },
  { path: 'manage-spaces', component: SpaceManagerComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'spaces/:spaceId', component: SpaceViewComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'planner', component: PlannerComponent },
  { path: 'upcoming', component: UpcomingComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },

];
