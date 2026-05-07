import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/Auth/Auth.service';
import { NavbarComponent } from '../homepage/components/navbar/navbar.component';
import { RentalService, RentalResponse } from '../../Services/Rental/rental.service';

// ── View Model ─────────────────────────────────────────────────────────────
export interface RentalVM extends RentalResponse {
  uiDayMade?: string;
  uiCheckIn?: string;
  uiCheckOut?: string;
  uiBadge?: { label: string; class: string; icon: string };
  uiCanCancel?: boolean;
  uiCanPay?: boolean;
}

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.css']
})
export class MyRentalsComponent implements OnInit {
  private rentalSvc = inject(RentalService);
  private router    = inject(Router);
  private toastr    = inject(ToastrService);
  authService       = inject(AuthService);

  rentals:   RentalVM[] = [];
  isLoading  = true;

  // Búsqueda por código
  searchCode   = '';
  searchResult: RentalVM | null = null;
  searchError  = '';
  isSearching  = false;

  // Cancelación
  cancelTarget: RentalVM | null = null;
  isCancelling  = false;

  // ── PAGO DE ANTICIPO ──────────────────────────────────────────────────
  payTarget:   RentalVM | null = null;
  isPaying     = false;
  paymentStep: 'confirm' | 'processing' | 'success' = 'confirm';

  activeTab: 'list' | 'search' = 'list';

  pendingCount   = 0;
  confirmedCount = 0;

  private readonly stateMap: Record<string, { label: string; class: string; icon: string }> = {
    PENDING:   { label: 'Pendiente',  class: 'bg-yellow-100 text-yellow-800 border-yellow-300',  icon: '⏳' },
    CONFIRMED: { label: 'Confirmada', class: 'bg-green-100  text-green-800  border-green-300',   icon: '✅' },
    CANCELLED: { label: 'Cancelada',  class: 'bg-red-100    text-red-800    border-red-300',     icon: '❌' },
    EXPIRED:   { label: 'Vencida',    class: 'bg-gray-100   text-gray-600   border-gray-300',    icon: '💤' }
  };
  private readonly defaultBadge = { label: 'Desconocido', class: 'bg-gray-100 text-gray-600 border-gray-300', icon: '•' };

  ngOnInit(): void {
    const user = this.authService.user();
    if (!user || this.authService.isOwner()) {
      this.toastr.warning('Debes iniciar sesión como cliente', 'Acceso denegado');
      this.router.navigate(['/']);
      return;
    }
    this.loadRentals(user.id);
  }

  loadRentals(customerId: string): void {
    this.isLoading = true;
    this.rentalSvc.findByCustomer(customerId).subscribe({
      next: (res) => {
        this.rentals = (res?.data ?? []).map(r => this.mapRentalToVM(r));
        this.updateCounters();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('No se pudieron cargar tus reservas', 'Error');
        this.isLoading = false;
      }
    });
  }

  private updateCounters(): void {
    this.pendingCount   = this.rentals.filter(r => r.state === 'PENDING').length;
    this.confirmedCount = this.rentals.filter(r => r.state === 'CONFIRMED').length;
  }

  searchByCode(): void {
    if (!this.searchCode.trim()) return;
    this.isSearching  = true;
    this.searchResult = null;
    this.searchError  = '';
    this.rentalSvc.findByCode(this.searchCode.trim()).subscribe({
      next: (res) => {
        this.searchResult = res?.data ? this.mapRentalToVM(res.data) : null;
        this.isSearching  = false;
        if (!this.searchResult) this.searchError = 'No se encontró ninguna reserva con ese código.';
      },
      error: () => {
        this.searchError = 'No se encontró ninguna reserva con ese código.';
        this.isSearching = false;
      }
    });
  }

  // ── Cancelación ─────────────────────────────────────────────────────────
  openCancelModal(rental: RentalVM): void  { this.cancelTarget = rental; }
  closeCancelModal(): void                  { this.cancelTarget = null; }

  confirmCancel(): void {
    if (!this.cancelTarget) return;
    const user = this.authService.user();
    if (!user) return;

    this.isCancelling = true;
    this.rentalSvc.cancelByCustomer(this.cancelTarget.id, user.id).subscribe({
      next: (res) => {
        const vmUpdated = res?.data ? this.mapRentalToVM(res.data) : null;
        if (vmUpdated) {
          const idx = this.rentals.findIndex(r => r.id === vmUpdated.id);
          if (idx !== -1) { this.rentals[idx] = vmUpdated; this.updateCounters(); }
          if (this.searchResult?.id === vmUpdated.id) this.searchResult = vmUpdated;
        }
        this.toastr.success('Reserva cancelada correctamente', '¡Cancelada!');
        this.isCancelling = false;
        this.cancelTarget = null;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'No se pudo cancelar', 'Error');
        this.isCancelling = false;
        this.cancelTarget = null;
      }
    });
  }

  // ── Pago del anticipo ────────────────────────────────────────────────────
  openPayModal(rental: RentalVM): void {
    this.payTarget    = rental;
    this.paymentStep  = 'confirm';
    this.isPaying     = false;
  }

  closePayModal(): void {
    if (this.isPaying) return; // no cerrar mientras procesa
    this.payTarget   = null;
    this.paymentStep = 'confirm';
  }

  /** Monto del anticipo (20% del total) */
  get depositAmount(): number {
    return this.payTarget ? Math.ceil(this.payTarget.totalPrice * 0.2) : 0;
  }

  /**
   * Confirma el pago del anticipo.
   * En la implementación actual el backend solo permite que el PROPIETARIO
   * registre pagos (el ownerId viene de la casa de la reserva).
   * Para esta fase frontend simulamos la confirmación mostrando el estado
   * actualizado: el cliente ve que ya "registró" su intención de pago y
   * el propietario la confirma desde su panel.
   *
   * Si el backend añade el endpoint /deposit para clientes, solo hay que
   * cambiar la llamada aquí a: this.rentalSvc.payDeposit(rentalId, amount)
   */
  confirmPayment(): void {
    if (!this.payTarget) return;
    this.isPaying    = true;
    this.paymentStep = 'processing';

    // Simulamos 1.5s de procesamiento (cuando el backend tenga el endpoint
    // específico del cliente, reemplazar este setTimeout por la llamada HTTP).
    // Por ahora mostramos el estado "success" informativo (el pago se hace
    // por transferencia externa; el propietario lo confirma).
    setTimeout(() => {
      this.paymentStep = 'success';
      this.isPaying    = false;

      // Actualizamos localmente para que el botón desaparezca y el mensaje
      // sea coherente — el estado real sigue siendo PENDING hasta que el
      // propietario lo confirme.
      const idx = this.rentals.findIndex(r => r.id === this.payTarget!.id);
      if (idx !== -1) {
        // Marcamos uiCanPay = false para que no aparezca de nuevo el botón
        this.rentals[idx] = { ...this.rentals[idx], uiCanPay: false };
      }
    }, 1500);
  }

  // ── Mapeo a ViewModel ───────────────────────────────────────────────────
  private mapRentalToVM(rental: RentalResponse): RentalVM {
    return {
      ...rental,
      uiDayMade:  this.formatDate(rental.rentalDayMade),
      uiCheckIn:  this.formatDate(rental.checkInDate),
      uiCheckOut: this.formatDate(rental.checkOutDate),
      uiBadge:    this.stateMap[rental.state] ?? this.defaultBadge,
      uiCanCancel: rental.state === 'PENDING',
      uiCanPay:    rental.state === 'PENDING'
    };
  }

  private formatDate(d: string): string {
    if (!d) return '';
    try {
      return new Date(d.split('T')[0] + 'T00:00:00').toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
    } catch { return d; }
  }
}