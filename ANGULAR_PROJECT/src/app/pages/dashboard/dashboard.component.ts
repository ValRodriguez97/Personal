import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userName = 'Usuario Demo';
  userType = 'Standard User'; // o 'Property Owner'
  sidebarOpen = true;

  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      icon: 'account_balance',
      label: 'Datos Bancarios',
      route: '/dashboard/bank-account'
    },
    {
      icon: 'verified_user',
      label: 'Volverse Propietario',
      route: '/dashboard/become-owner',
      badge: 'NEW'
    },
    {
      icon: 'settings',
      label: 'Configuración',
      route: '/dashboard/settings'
    }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    // Implementar logout
    this.router.navigate(['/']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
