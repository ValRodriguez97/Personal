import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

interface FormErrors {
  accountNumber?: string;
  bankName?: string;
  accountType?: string;
  balance?: string;
}

@Component({
  selector: 'app-bank-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent {
  showAddModal = false;
  isLoading = false;
  editingAccountId: string | null = null;

  formData: BankForm = {
    accountNumber: '',
    bankName: '',
    accountType: 'ahorros',
    balance: ''
  };

  errors: FormErrors = {};

  accounts: BankAccount[] = [];

  accountTypes = [
    { value: 'ahorros', label: 'Cuenta de Ahorros' },
    { value: 'corriente', label: 'Cuenta Corriente' },
    { value: 'nomina', label: 'Cuenta Nómina' },
    { value: 'inversion', label: 'Cuenta de Inversión' }
  ];

  popularBanks = [
    'Banco Santander', 'BBVA', 'CaixaBank', 'Banco Sabadell',
    'Bankia', 'ING Direct', 'Banco Popular', 'Unicaja Banco',
    'Liberbank', 'Kutxabank', 'Otro'
  ];

  constructor(private toastr: ToastrService) {
    // Cargar cuentas de ejemplo (en producción vendría de API)
    this.loadAccounts();
  }

  loadAccounts(): void {
    // Simulación de cuentas guardadas
    this.accounts = [];
  }

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
    this.formData = {
      accountNumber: '',
      bankName: '',
      accountType: 'ahorros',
      balance: ''
    };
    this.errors = {};
  }

  onInputChange(field: keyof FormErrors): void {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!this.formData.accountNumber) {
      newErrors.accountNumber = 'El número de cuenta es requerido';
    } else if (this.formData.accountNumber.length < 10) {
      newErrors.accountNumber = 'El número de cuenta debe tener al menos 10 dígitos';
    }

    if (!this.formData.bankName) {
      newErrors.bankName = 'El nombre del banco es requerido';
    }

    if (!this.formData.accountType) {
      newErrors.accountType = 'Selecciona un tipo de cuenta';
    }

    if (!this.formData.balance) {
      newErrors.balance = 'El balance es requerido';
    } else if (parseFloat(this.formData.balance) < 0) {
      newErrors.balance = 'El balance no puede ser negativo';
    }

    this.errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      // Simulación de llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAccount: BankAccount = {
        id: this.editingAccountId || Date.now().toString(),
        accountNumber: this.formData.accountNumber,
        bankName: this.formData.bankName,
        accountType: this.formData.accountType,
        balance: parseFloat(this.formData.balance),
        isPrimary: this.accounts.length === 0,
        createdAt: new Date()
      };

      if (this.editingAccountId) {
        // Editar cuenta existente
        const index = this.accounts.findIndex(a => a.id === this.editingAccountId);
        if (index !== -1) {
          this.accounts[index] = { ...this.accounts[index], ...newAccount };
        }
        this.toastr.success('Cuenta actualizada correctamente', '¡Éxito!');
      } else {
        // Agregar nueva cuenta
        this.accounts.push(newAccount);
        this.toastr.success('Cuenta bancaria añadida correctamente', '¡Éxito!');
      }

      this.closeModal();
    } catch (error) {
      this.toastr.error('Por favor intenta nuevamente', 'Error al guardar');
    } finally {
      this.isLoading = false;
    }
  }

  setPrimaryAccount(accountId: string): void {
    this.accounts = this.accounts.map(account => ({
      ...account,
      isPrimary: account.id === accountId
    }));
    this.toastr.success('Cuenta principal actualizada', '¡Listo!');
  }

  deleteAccount(accountId: string): void {
    if (confirm('¿Estás seguro de eliminar esta cuenta bancaria?')) {
      this.accounts = this.accounts.filter(a => a.id !== accountId);
      this.toastr.success('Cuenta eliminada correctamente', '¡Eliminada!');
    }
  }

  formatAccountNumber(accountNumber: string): string {
    // Mostrar solo los últimos 4 dígitos
    return '**** **** **** ' + accountNumber.slice(-4);
  }

  formatBalance(balance: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(balance);
  }

  getAccountTypeLabel(type: string): string {
    const found = this.accountTypes.find(t => t.value === type);
    return found ? found.label : type;
  }
}
