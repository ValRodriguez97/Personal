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
  private auth        = inject(AuthService);
  private rentalSvc   = inject(RentalService);
  private houseSvc    = inject(CountryHouseService);
  private toastr      = inject(ToastrService);
  private router      = inject(Router);
  private destroyRef  = inject(DestroyRef);

  rentals: RentalResponse[] = [];
  ownerHouseCodes = new Set<string>();
  isLoading       = true;

  /** ID de la reserva que está siendo procesada (confirmar/cancelar) */
  processingId: string | null = null;

  selectedTab: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'ALL' = 'ALL';

  // ── Modal: confirmar pago recibido (Escenario 1, US08) ──
  confirmTarget: RentalResponse | null = null;

  // ── Modal: cancelar reserva (desde acciones directas) ──
  cancelTarget: RentalResponse | null = null;
  isCancelling = false;

  /**
   * Modal Escenario 2 (US08):
   * Se activa cuando han pasado más de 3 días sin pago registrado.
   * El propietario decide si cancelar o mantener la reserva pendiente.
   */
  expiredTarget: RentalResponse | null = null;
  isProcessingExpired = false;

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

  get pendingCount():   number {
    return this.rentals.filter(r => this.ownerHouseCodes.has(r.countryHouseCode) && r.state === 'PENDING').length;
  }
  get confirmedCount(): number {
    return this.rentals.filter(r => this.ownerHouseCodes.has(r.countryHouseCode) && r.state === 'CONFIRMED').length;
  }

  /**
   * Cuenta de reservas vencidas sin atender: PENDING con más de 3 días sin pago.
   * Se usa para mostrar badge de alerta en el tab.
   */
  get expiredPendingCount(): number {
    return this.rentals.filter(r =>
      this.ownerHouseCodes.has(r.countryHouseCode) &&
      r.state === 'PENDING' &&
      this.isOverdue(r)
    ).length;
  }

  // ── ESCENARIO 1: Confirmar pago recibido ─────────────────────────────────

  openConfirmModal(rental: RentalResponse): void {
    this.confirmTarget = rental;
  }

  closeConfirmModal(): void {
    this.confirmTarget = null;
  }

  confirmPayment(): void {
    if (!this.confirmTarget) return;
    const ownerId = this.auth.user()?.id;
    if (!ownerId) return;

    const rental = this.confirmTarget;
    this.processingId  = rental.id;
    this.confirmTarget = null;

    // El backend espera el monto del anticipo (20%)
    const amount = Math.ceil(rental.totalPrice * 0.2);

    this.rentalSvc.registerPaymentAsOwner(rental.id, amount, ownerId).subscribe({
      next: () => {
        this.toastr.success(
          `Reserva ${rental.rentalCode} confirmada. El cliente puede visualizar la confirmación.`,
          '✅ Pago confirmado'
        );
        this.processingId = null;
        // El cache reactivo ya actualizó el estado a CONFIRMED en registerPaymentAsOwner
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'No se pudo confirmar el pago', 'Error');
        this.processingId = null;
      }
    });
  }

  // ── ESCENARIO 2: Reservas con pago vencido (>3 días) ─────────────────────

  /**
   * Determina si una reserva PENDING tiene más de 3 días sin pago.
   * Criterio: la fecha en que se hizo la reserva + 3 días < hoy.
   */
  isOverdue(rental: RentalResponse): boolean {
    if (rental.state !== 'PENDING') return false;
    try {
      const madeDateMs = new Date(rental.rentalDayMade.split('T')[0] + 'T00:00:00').getTime();
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      return Date.now() > madeDateMs + threeDaysMs;
    } catch {
      return false;
    }
  }

  /** Días transcurridos desde que se hizo la reserva */
  daysSinceCreation(rental: RentalResponse): number {
    try {
      const madeDateMs = new Date(rental.rentalDayMade.split('T')[0] + 'T00:00:00').getTime();
      return Math.floor((Date.now() - madeDateMs) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }

  /**
   * Abre el modal del Escenario 2.
   * Permite al propietario decidir entre cancelar o mantener
   * la reserva que lleva más de 3 días sin pago registrado.
   */
  openExpiredModal(rental: RentalResponse): void {
    this.expiredTarget = rental;
  }

  closeExpiredModal(): void {
    this.expiredTarget = null;
  }

  /**
   * Escenario 2, opción A: El propietario decide CANCELAR la reserva vencida.
   * Llama al endpoint POST /api/rentals/{rentalId}/cancel?ownerId={id}
   */
  cancelExpiredRental(): void {
    if (!this.expiredTarget) return;
    const ownerId = this.auth.user()?.id;
    if (!ownerId) return;

    const rental = this.expiredTarget;
    this.isProcessingExpired = true;
    this.expiredTarget       = null;

    this.rentalSvc.cancelAsOwner(rental.id, ownerId).subscribe({
      next: () => {
        this.toastr.warning(
          `Reserva ${rental.rentalCode} cancelada por falta de pago. Las fechas quedan libres.`,
          '❌ Reserva cancelada'
        );
        this.isProcessingExpired = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'No se pudo cancelar la reserva', 'Error');
        this.isProcessingExpired = false;
      }
    });
  }

  /**
   * Escenario 2, opción B: El propietario decide MANTENER la reserva vencida.
   * No llama al backend, solo cierra el modal. La reserva sigue PENDING.
   * El propietario puede confirmar el pago más adelante si lo recibe.
   */
  keepExpiredRental(): void {
    if (!this.expiredTarget) return;
    const rental = this.expiredTarget;
    this.expiredTarget = null;
    this.toastr.info(
      `Reserva ${rental.rentalCode} mantenida. Puedes confirmar el pago cuando lo recibas.`,
      'Reserva mantenida'
    );
  }

  // ── Cancelar reserva (acción directa del propietario) ────────────────────

  openCancelModal(rental: RentalResponse): void {
    this.cancelTarget = rental;
  }

  closeCancelModal(): void {
    this.cancelTarget = null;
  }

  confirmCancel(): void {
    if (!this.cancelTarget) return;
    const ownerId = this.auth.user()?.id;
    if (!ownerId) return;

    const rental = this.cancelTarget;
    this.isCancelling  = true;
    this.cancelTarget  = null;

    this.rentalSvc.cancelAsOwner(rental.id, ownerId).subscribe({
      next: () => {
        this.toastr.warning(
          `Reserva ${rental.rentalCode} cancelada.`,
          '❌ Reserva cancelada'
        );
        this.isCancelling = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'No se pudo cancelar la reserva', 'Error');
        this.isCancelling = false;
      }
    });
  }

  // ── Helpers de UI ─────────────────────────────────────────────────────────

  canMarkExpired(rental: RentalResponse): boolean {
    return rental.state === 'PENDING' && this.isOverdue(rental);
  }

  markExpired(rental: RentalResponse): void {
    // Actualización local para la UI mientras el backend no tiene endpoint dedicado
    this.rentalSvc.updateRentalStateLocal(rental.id, 'EXPIRED');
    this.toastr.warning(`Reserva ${rental.rentalCode} marcada como vencida`, 'Vencida');
  }

  isProcessing(rentalId: string): boolean {
    return this.processingId === rentalId;
  }

  formatDate(date: string): string {
    if (!date) return '';
    try {
      return new Date(date.split('T')[0] + 'T00:00:00').toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch { return date; }
  }

  private listenReactiveRentals(): void {
    this.rentalSvc.observeRentals()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rentals) => {
        this.rentals = [...rentals].sort((a, b) =>
          b.rentalDayMade.localeCompare(a.rentalDayMade)
        );
        this.isLoading = false;
      });
  }

  private hydrateOwnerRentals(ownerId: string): void {
    // Cargamos las reservas de las casas del propietario
    // El backend tiene GET /api/rentals/house/{houseId} pero no un endpoint
    // por propietario directo, así que cargamos reserva a reserva por casa
    this.houseSvc.findByOwner(ownerId).subscribe({
      next: (res) => {
        const houses = res?.data ?? [];
        // Cargar reservas de cada casa activa
        houses.forEach(house => {
          this.loadRentalsForHouse(house.id);
        });
      },
      error: () => {
        this.toastr.error('No se pudieron cargar las reservas', 'Error');
      }
    });
  }

  private loadRentalsForHouse(houseId: string): void {
    // GET /api/rentals/house/{houseId}
    this.rentalSvc.findByOwner(houseId).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}