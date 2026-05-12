import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/Auth/Auth.service';
import { NavbarComponent } from '../homepage/components/navbar/navbar.component';
import { RentalService, RentalResponse } from '../../Services/Rental/rental.service';
import { BankAccountService } from '../../Services/BankAccount/BankAccount.service';
import { CountryHouseService } from '../../Services/CountryHouse/country-house.service';
import { switchMap, of } from 'rxjs';

interface RentalVM extends RentalResponse {
  uiCheckIn?: string;
  uiCheckOut?: string;
  uiDayMade?: string;
  uiBadge?: { label: string; icon: string; class: string };
  uiCanPay?: boolean;
  uiCanCancel?: boolean;
}

interface BankAccountData {
  id: string;
  numberAccount: string;
  bank: string;
  accountType: string;
  mount: number;
}

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.css']
})
export class MyRentalsComponent implements OnInit {
  private rentalSvc   = inject(RentalService);
  private bankSvc     = inject(BankAccountService);
  private houseSvc    = inject(CountryHouseService);
  authService         = inject(AuthService);
  private toastr      = inject(ToastrService);
  private router      = inject(Router);

  rentals: RentalVM[] = [];
  isLoading = true;

  activeTab: 'list' | 'search' = 'list';

  searchCode = '';
  searchResult: RentalVM | null = null;
  searchError = '';
  isSearching = false;

  cancelTarget: RentalVM | null = null;
  isCancelling = false;

  payTarget: RentalVM | null = null;
  isPaying = false;
  paymentStep: 'select_account' | 'confirm' | 'processing' | 'success' = 'select_account';

  customerAccounts: BankAccountData[] = [];
  ownerAccounts: BankAccountData[] = [];
  isLoadingAccounts = false;
  isLoadingOwnerAccounts = false;
  selectedCustomerAccountId = '';
  selectedOwnerAccountId = '';

  get pendingCount(): number { return this.rentals.filter(r => r.state === 'PENDING').length; }
  get confirmedCount(): number { return this.rentals.filter(r => r.state === 'CONFIRMED').length; }

  get depositAmount(): number {
    return this.payTarget ? this.payTarget.totalPrice * 0.2 : 0;
  }

  get selectedCustomerAccount(): BankAccountData | undefined {
    return this.customerAccounts.find(a => a.id === this.selectedCustomerAccountId);
  }

  get selectedOwnerAccount(): BankAccountData | undefined {
    return this.ownerAccounts.find(a => a.id === this.selectedOwnerAccountId);
  }

  get hasSufficientFunds(): boolean {
    const acc = this.selectedCustomerAccount;
    return !!acc && acc.mount >= this.depositAmount;
  }

  get readyToPay(): boolean {
    return !!this.selectedCustomerAccountId &&
           !!this.selectedOwnerAccountId &&
           this.hasSufficientFunds;
  }

  get isLoadingAnyAccounts(): boolean {
    return this.isLoadingAccounts || this.isLoadingOwnerAccounts;
  }

  ngOnInit(): void {
    const user = this.authService.user();
    if (!user || this.authService.isOwner()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadRentals(user.id);
  }

  loadRentals(customerId: string): void {
    this.isLoading = true;
    this.rentalSvc.findByCustomer(customerId).subscribe({
      next: (res) => {
        this.rentals = (res?.data ?? []).map(r => this.toVM(r));
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('No se pudieron cargar tus reservas', 'Error');
        this.isLoading = false;
      }
    });
  }

  private toVM(r: RentalResponse): RentalVM {
    return {
      ...r,
      uiCheckIn:   this.formatDate(r.checkInDate),
      uiCheckOut:  this.formatDate(r.checkOutDate),
      uiDayMade:   this.formatDate(r.rentalDayMade),
      uiBadge:     this.getBadge(r.state),
      uiCanPay:    r.state === 'PENDING' && this.authService.isLoggedIn() && !this.authService.isOwner(),
      uiCanCancel: r.state === 'PENDING' || r.state === 'CONFIRMED'
    };
  }

  private getBadge(state: string): { label: string; icon: string; class: string } {
    const map: Record<string, { label: string; icon: string; class: string }> = {
      PENDING:   { label: 'Pendiente',  icon: '⏳', class: 'bg-yellow-50 text-yellow-800 border-yellow-200'   },
      CONFIRMED: { label: 'Confirmada', icon: '✅', class: 'bg-green-50 text-green-800 border-green-200'       },
      PAID:      { label: 'Pagada',     icon: '💚', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
      CANCELLED: { label: 'Cancelada',  icon: '❌', class: 'bg-red-50 text-red-700 border-red-200'             },
      EXPIRED:   { label: 'Vencida',    icon: '💤', class: 'bg-gray-50 text-gray-600 border-gray-200'          }
    };
    return map[state] ?? { label: state, icon: '', class: 'bg-gray-50 text-gray-600 border-gray-200' };
  }

  searchByCode(): void {
    if (!this.searchCode.trim()) return;
    this.isSearching = true;
    this.searchError = '';
    this.searchResult = null;
    this.rentalSvc.findByCode(this.searchCode.trim()).subscribe({
      next: (res) => {
        const r = res?.data;
        if (r) { this.searchResult = this.toVM(r); }
        else   { this.searchError = 'No se encontró ninguna reserva con ese código.'; }
        this.isSearching = false;
      },
      error: () => {
        this.searchError = 'No se encontró ninguna reserva con ese código.';
        this.isSearching = false;
      }
    });
  }

  openCancelModal(rental: RentalVM): void  { this.cancelTarget = rental; }
  closeCancelModal(): void { this.cancelTarget = null; }

  confirmCancel(): void {
    if (!this.cancelTarget) return;
    const rental = this.cancelTarget;
    this.isCancelling = true;
    this.cancelTarget = null;
    this.toastr.info(
      `Para cancelar la reserva ${rental.rentalCode} contacta al propietario.`,
      'Cancelación'
    );
    this.isCancelling = false;
  }

  openPayModal(rental: RentalVM): void {
    this.payTarget    = rental;
    this.paymentStep  = 'select_account';
    this.selectedCustomerAccountId = '';
    this.selectedOwnerAccountId    = '';
    this.customerAccounts = [];
    this.ownerAccounts    = [];
    this.loadCustomerAccounts();
    this.loadOwnerAccountsForRental(rental);
  }

  closePayModal(): void {
    if (this.paymentStep === 'success') {
      this.loadRentals(this.authService.user()!.id);
    }
    this.payTarget   = null;
    this.paymentStep = 'select_account';
  }

  private loadCustomerAccounts(): void {
    const userId = this.authService.user()?.id;
    if (!userId) return;
    this.isLoadingAccounts = true;
    this.bankSvc.getByUser(userId).subscribe({
      next: (res) => { this.customerAccounts = res?.data ?? []; this.isLoadingAccounts = false; },
      error: ()    => { this.isLoadingAccounts = false; }
    });
  }

  /**
   * Carga las cuentas bancarias del propietario con tres niveles de fallback:
   *
   * Nivel 1 — rental.ownerId existe → llamada directa a BankAccountService.
   * Nivel 2 — rental.ownerId vacío → busca la casa por countryHouseCode para obtener
   *            su id, luego obtiene las reservas de esa casa (que sí traen ownerId)
   *            y llama a BankAccountService con ese id.
   * Nivel 3 — si aun así no hay ownerId → muestra mensaje de aviso.
   */
  private loadOwnerAccountsForRental(rental: RentalVM): void {
    this.isLoadingOwnerAccounts = true;

    this.houseSvc.findByCode(rental.countryHouseCode).pipe(
      switchMap((houseRes) => {
        const ownerId = houseRes?.data?.ownerId;
        if (!ownerId) return of(null);
        return this.bankSvc.getByUser(ownerId);
      })
    ).subscribe({

      next: (res) => {
        if (!res) { this.noOwnerAccountsFound(); return; }
        this.ownerAccounts = res?.data ?? [];
        this.isLoadingOwnerAccounts = false;
      },

      error: () => {
        this.noOwnerAccountsFound();
      }
    })
  }

  private fetchOwnerAccounts(ownerId: string): void {
    this.bankSvc.getByUser(ownerId).subscribe({
      next: (res) => {
        this.ownerAccounts = res?.data ?? [];
        this.isLoadingOwnerAccounts = false;
        if (this.ownerAccounts.length === 0) {
          this.toastr.warning(
            'El propietario no tiene cuentas bancarias registradas. Contacta con él directamente.',
            'Sin cuentas del propietario'
          );
        }
      },
      error: () => this.noOwnerAccountsFound()
    });
  }

  private noOwnerAccountsFound(): void {
    this.ownerAccounts = [];
    this.isLoadingOwnerAccounts = false;
    this.toastr.warning(
      'No se pudieron cargar las cuentas del propietario. Contacta con él directamente.',
      'Aviso'
    );
  }

  proceedToConfirm(): void {
    if (!this.readyToPay) return;
    this.paymentStep = 'confirm';
  }

  confirmPayment(): void {
    if (!this.payTarget) return;
    const customerId = this.authService.user()?.id;
    if (!customerId) return;
    this.paymentStep = 'processing';
    this.rentalSvc.payDeposit(this.payTarget.id, customerId, {
      customerBankAccountId: this.selectedCustomerAccountId,
      ownerBankAccountId:    this.selectedOwnerAccountId,
      amount:                this.depositAmount
    }).subscribe({
      next: () => {
        this.paymentStep = 'success';
        this.rentals = this.rentals.map(r =>
          r.id === this.payTarget?.id
            ? { ...r, state: 'CONFIRMED', uiBadge: this.getBadge('CONFIRMED'), uiCanPay: false }
            : r
        );
        if (this.searchResult?.id === this.payTarget?.id) {
          this.searchResult = {
            ...this.searchResult,
            state:    'CONFIRMED',
            uiBadge:  this.getBadge('CONFIRMED'),
            uiCanPay: false
          };
        }
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Error al procesar el pago', 'Error');
        this.paymentStep = 'select_account';
      }
    });
  }

  formatDate(d: string): string {
    if (!d) return '';
    try {
      return new Date(d.split('T')[0] + 'T00:00:00').toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
    } catch { return d; }
  }

  formatBalance(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(amount ?? 0);
  }
}