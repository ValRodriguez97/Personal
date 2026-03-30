import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { BankAccountComponent } from './pages/dashboard/bank-account/bank-account.component';
import { BecomeOwnerComponent } from './pages/dashboard/become-owner/become-owner.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login - Rural Rental'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Crear Cuenta - Rural Rental'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Dashboard - Rural Rental'
      },
      {
        path: 'bank-account',
        component: BankAccountComponent,
        title: 'Datos Bancarios - Rural Rental'
      },
      {
        path: 'become-owner',
        component: BecomeOwnerComponent,
        title: 'Volverse Propietario - Rural Rental'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];