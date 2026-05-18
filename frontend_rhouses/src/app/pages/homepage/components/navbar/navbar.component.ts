import { Component, Input, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../Services/Auth/Auth.service';
import { RentalService } from '../../../../Services/Rental/rental.service';
import { LucideAngularModule } from 'lucide-angular';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html'
})

export class NavbarComponent {
  @Output() back = new EventEmitter<void>();
  @Output() home = new EventEmitter<void>();
  authService = inject(AuthService);
  private router = inject(Router);
  private rentalService = inject(RentalService);

  dropdownOpen = false;

  get displayName(): string {
    return this.authService.user()?.fullName?.trim() || this.authService.user()?.userName || '';
  }

  get avatarUrl(): string {
    return this.authService.user()?.avatarUrl ?? '';
  }

  get userName(): string {
    return this.displayName;
  }

  get userInitial(): string {
    return this.displayName
      ? this.displayName.charAt(0).toUpperCase()
      : '';
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  goToSettings(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.dropdownOpen = false;
    this.rentalService.clearCache();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-btn') && !target.closest('#user-dropdown')) {
      this.dropdownOpen = false;
    }
  }

  goToMyRentals(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/my-rentals']);
  }

  goToOwnerReservations(): void {
    this.dropdownOpen = false;
    this.router.navigate(['/owner-reservations']);
  }

}