import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../homepage/components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/Auth/Auth.service';

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  balance: number;
  isPrimary: boolean;
  createdAt: Date;
}

interface BankForm {
  accountNumber: string;
  bankName: string;
  accountType: string;
  balance: string;
}

interface BankFormErrors {
  accountNumber?: string;
  bankName?: string;
  accountType?: string;
  balance?: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  activeTab: 'profile' | 'bank' = 'bank';

  // ── Bank accounts (lógica portada de ANGULAR_PROJECT) ──
  showAddModal = false;
  isLoading = false;
  editingAccountId: string | null = null;

  formData: BankForm = { accountNumber: '', bankName: '', accountType: 'ahorros', balance: '' };
  errors: BankFormErrors = {};
  accounts: BankAccount[] = [];

  accountTypes = [
    { value: 'ahorros',   label: 'Cuenta de Ahorros' },
    { value: 'corriente', label: 'Cuenta Corriente' },
    { value: 'nomina',    label: 'Cuenta Nómina' },
    { value: 'inversion', label: 'Cuenta de Inversión' }
  ];

  popularBanks = [
    'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA Colombia',
    'Banco Santander', 'CaixaBank', 'ING Direct', 'Nequi / Bancolombia',
    'Banco Popular', 'Scotiabank Colpatria', 'Otro'
  ];

  openAddModal(): void {
    this.showAddModal = true;
    this.editingAccountId = null;
    this.resetForm();
  }

  openEditModal(account: BankAccount): void {
    this.showAddModal = true;
    this.editingAccountId = account.id;
    this.formData = {
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      accountType: account.accountType,
      balance: account.balance.toString()
    };
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingAccountId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = { accountNumber: '', bankName: '', accountType: 'ahorros', balance: '' };
    this.errors = {};
  }

  onInputChange(field: keyof BankFormErrors): void {
    if (this.errors[field]) delete this.errors[field];
  }

  validateForm(): boolean {
    const e: BankFormErrors = {};
    if (!this.formData.accountNumber) {
      e.accountNumber = 'El número de cuenta es requerido';
    } else if (this.formData.accountNumber.replace(/\s/g, '').length < 10) {
      e.accountNumber = 'El número de cuenta debe tener al menos 10 dígitos';
    }
    if (!this.formData.bankName) e.bankName = 'Selecciona un banco';
    if (!this.formData.accountType) e.accountType = 'Selecciona un tipo de cuenta';
    if (!this.formData.balance) {
      e.balance = 'El balance es requerido';
    } else if (parseFloat(this.formData.balance) < 0) {
      e.balance = 'El balance no puede ser negativo';
    }
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) return;
    this.isLoading = true;
    await new Promise(r => setTimeout(r, 900));

    const account: BankAccount = {
      id: this.editingAccountId || Date.now().toString(),
      accountNumber: this.formData.accountNumber,
      bankName: this.formData.bankName,
      accountType: this.formData.accountType,
      balance: parseFloat(this.formData.balance),
      isPrimary: this.accounts.length === 0,
      createdAt: new Date()
    };

    if (this.editingAccountId) {
      const idx = this.accounts.findIndex(a => a.id === this.editingAccountId);
      if (idx !== -1) this.accounts[idx] = { ...this.accounts[idx], ...account };
      this.toastr.success('Cuenta actualizada correctamente', '¡Éxito!');
    } else {
      this.accounts.push(account);
      this.toastr.success('Cuenta bancaria añadida', '¡Éxito!');
    }

    this.isLoading = false;
    this.closeModal();
  }

  setPrimaryAccount(id: string): void {
    this.accounts = this.accounts.map(a => ({ ...a, isPrimary: a.id === id }));
    this.toastr.success('Cuenta principal actualizada', '¡Listo!');
  }

  deleteAccount(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta cuenta bancaria?')) {
      this.accounts = this.accounts.filter(a => a.id !== id);
      this.toastr.success('Cuenta eliminada', '¡Eliminada!');
    }
  }

  formatAccountNumber(n: string): string {
    return '**** **** **** ' + n.slice(-4);
  }

  formatBalance(b: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(b);
  }

  getAccountTypeLabel(t: string): string {
    return this.accountTypes.find(at => at.value === t)?.label ?? t;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}