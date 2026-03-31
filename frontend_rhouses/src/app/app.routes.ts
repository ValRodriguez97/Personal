import { Routes } from '@angular/router';
import { HomepageComponent }  from './pages/homepage/homepage.component';
import { LoginComponent }     from './pages/login/login.component';
import { RegisterComponent }  from './pages/register/register.component';
import { SettingsComponent } from './pages/settings/Settings.component';

export const routes: Routes = [
  { path: '',         component: HomepageComponent },
  { path: 'login',    component: LoginComponent    },
  { path: 'register', component: RegisterComponent  },
  { path: 'settings', component: SettingsComponent  },
  { path: '**',       redirectTo: '', pathMatch: 'full' }
];