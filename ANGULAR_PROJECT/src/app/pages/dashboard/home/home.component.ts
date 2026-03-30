import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  stats: StatCard[] = [
    {
      icon: 'home',
      label: 'Propiedades Guardadas',
      value: '12',
      change: '+3 este mes',
      isPositive: true
    },
    {
      icon: 'account_balance',
      label: 'Cuentas Bancarias',
      value: '0',
      change: 'Añade una cuenta',
      isPositive: false
    },
    {
      icon: 'bookmarks',
      label: 'Reservas Activas',
      value: '3',
      change: '+1 esta semana',
      isPositive: true
    },
    {
      icon: 'verified',
      label: 'Estado de Cuenta',
      value: 'Estándar',
      change: 'Conviértete en propietario',
      isPositive: false
    }
  ];

  recentActivity = [
    {
      icon: 'favorite',
      action: 'Guardaste una propiedad',
      property: 'Cabaña en las Montañas',
      time: 'Hace 2 horas',
      color: 'text-[#AA4465]'
    },
    {
      icon: 'visibility',
      action: 'Viste una propiedad',
      property: 'Casa Rural en el Bosque',
      time: 'Hace 5 horas',
      color: 'text-blue-500'
    },
    {
      icon: 'search',
      action: 'Buscaste en',
      property: 'Zona Norte, Montañas',
      time: 'Hace 1 día',
      color: 'text-[#2CA58D]'
    }
  ];
}
