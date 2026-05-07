import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/Auth/Auth.service';
import { CountryHouseService } from '../../Services/CountryHouse/country-house.service';
import { RentalResponse, RentalService } from '../../Services/Rental/rental.service';
import { NavbarComponent } from '../homepage/components/navbar/navbar.component';

@Component({
  selector: 'app-owner-reservations',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './owner-reservations.component.html',
  styleUrls: ['./owner-reservations.component.css']
})
export class OwnerReservationsComponent implements OnInit {
  private auth = inject(AuthService);
  private rentalSvc = inject(RentalService);
  private houseSvc = inject(CountryHouseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  rentals: RentalResponse[] = [];
  ownerHouseCodes = new Set<string>();
  isLoading = true;
  confirmingId: string | null = null; // ID de la reserva que se está confirmando
  selectedTab: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'ALL' = 'ALL';

  ngOnInit(): void {
    const ownerId = this.auth.user()?.id;
    if (!ownerId || !this.auth.isOwner()) {
      this.router.navigate(['/']);
      return;
    }

    this.houseSvc.findByOwner(ownerId).subscribe({
      next: (res) => {
        this.ownerHouseCodes = new Set((res?.data ?? []).map((h) => h.code));
        this.listenReactiveRentals();
        this.hydrateOwnerRentals(ownerId);
      },
      error: () => {
        this.toastr.error('No se pudieron cargar tus casas', 'Error');
        this.isLoading = false;
      }
    });
  }

  get filteredRentals(): RentalResponse[] {
    const filtered = this.rentals.filter((r) => this.ownerHouseCodes.has(r.countryHouseCode));
    if (this.selectedTab === 'ALL') return filtered;
    return filtered.filter((r) => r.state === this.selectedTab);
  }

  /**
   * El propietario confirma el pago del 20% de anticipo de una reserva.
   * Llama al endpoint correcto con su propio ownerId.
   */
  confirmPayment(rental: RentalResponse): void {
    const ownerId = this.auth.user()?.id;
    if (!ownerId) return;

    this.confirmingId = rental.id;
    const amount = Math.ceil(rental.totalPrice * 0.2);

    this.rentalSvc.registerPaymentAsOwner(rental.id, amount, ownerId).subscribe({
      next: () => {
        // El servicio ya actualiza el estado en el cache reactivo a CONFIRMED
        this.toastr.success(`Reserva ${rental.rentalCode} confirmada`, 'Pago registrado');
        this.confirmingId = null;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'No se pudo confirmar el pago', 'Error');
        this.confirmingId = null;
      }
    });
  }

  keepPending(): void {
    this.toastr.info('La reserva permanece en estado pendiente', 'Sin cambios');
  }

  cancelExpired(rental: RentalResponse): void {
    const ownerId = this.auth.user()?.id;
    if (!ownerId) return;

    this.rentalSvc.updateRentalStateLocal(rental.id, 'EXPIRED');
    this.toastr.warning(`Reserva ${rental.rentalCode} marcada como vencida`, 'Reserva expirada');
  }

  canCancelExpired(rental: RentalResponse): boolean {
    if (rental.state !== 'PENDING') return false;
    const checkIn = new Date(rental.checkInDate.split('T')[0] + 'T00:00:00').getTime();
    return checkIn < new Date().setHours(0, 0, 0, 0);
  }

  isConfirming(rentalId: string): boolean {
    return this.confirmingId === rentalId;
  }

  formatDate(date: string): string {
    return new Date(date.split('T')[0] + 'T00:00:00').toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  private listenReactiveRentals(): void {
    this.rentalSvc.observeRentals()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rentals) => {
        this.rentals = [...rentals].sort((a, b) => b.rentalDayMade.localeCompare(a.rentalDayMade));
        this.isLoading = false;
      });
  }

  private hydrateOwnerRentals(ownerId: string): void {
    this.rentalSvc.findByOwner(ownerId).subscribe({
      next: () => {},
      error: () => {
        this.toastr.error('No se pudieron cargar las reservas', 'Error');
      }
    });
  }
}