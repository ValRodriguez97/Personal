import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/Auth/Auth.service';
import { CountryHouseService, RentalPackageResponse } from '../../Services/CountryHouse/country-house.service';
import { NavbarComponent } from '../homepage/components/navbar/navbar.component';

interface PackageForm {
  startingDate: string;
  endingDate: string;
  priceNight: number | null;
  typeRental: 'ENTIRE_HOUSE' | 'ROOMS' | 'BOTH';
}

@Component({
  selector: 'app-rental-package',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './rental-package.component.html' // 👈 IMPORTANTE
})
export class RentalPackageComponent implements OnInit {

  private route       = inject(ActivatedRoute);
  private router      = inject(Router);
  private authService = inject(AuthService);
  private houseSvc    = inject(CountryHouseService);
  private toastr      = inject(ToastrService);

  ownerId: string | null = null;
  houseId: string | null = null;

  packages: RentalPackageResponse[] = [];
  isLoading  = true;
  isSaving   = false;
  showForm   = false;
  editingId: string | null = null;

  today = new Date().toISOString().split('T')[0];

  form: PackageForm = {
    startingDate: '',
    endingDate: '',
    priceNight: null,
    typeRental: 'ENTIRE_HOUSE'
  };

  rentalTypeOptions = [
    { value: 'ENTIRE_HOUSE', label: 'Casa completa', desc: 'Se alquila todo' },
    { value: 'ROOMS',        label: 'Por habitaciones', desc: 'Solo cuartos' },
    { value: 'BOTH',         label: 'Ambas',            desc: 'Ambas opciones' }
  ];

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.paramMap.get('ownerid');
    this.houseId = this.route.snapshot.paramMap.get('houseid');

    if (!this.authService.isOwner() || !this.ownerId || !this.houseId) {
      this.toastr.warning('Acceso no autorizado', 'Error');
      this.router.navigate(['/']);
      return;
    }
    this.loadPackages();
  }

  loadPackages(): void {
    this.isLoading = true;
    this.houseSvc.getPackagesByHouse(this.houseId!).subscribe({
      next: (res) => {
        this.packages  = res?.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('No se pudieron cargar los paquetes', 'Error');
        this.isLoading = false;
      }
    });
  }

  openForm(): void {
    this.editingId = null;
    this.form = { startingDate: '', endingDate: '', priceNight: null, typeRental: 'ENTIRE_HOUSE' };
    this.showForm = true;
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }

  editPackage(pkg: RentalPackageResponse): void {
    this.editingId = pkg.id;
    this.form = {
      startingDate: pkg.startingDate,
      endingDate:   pkg.endingDate,
      priceNight:   pkg.priceNight,
      typeRental:   pkg.typeRental as any
    };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm  = false;
    this.editingId = null;
  }

  savePackage(): void {
    if (!this.form.startingDate || !this.form.endingDate || !this.form.priceNight) {
      this.toastr.warning('Completa todos los campos obligatorios', 'Campos requeridos');
      return;
    }

    if (new Date(this.form.startingDate) >= new Date(this.form.endingDate)) {
      this.toastr.warning('La fecha de inicio debe ser anterior a la fecha de fin', 'Fechas inválidas');
      return;
    }

    this.isSaving = true;

    const payload = {
      startingDate: this.form.startingDate,
      endingDate:   this.form.endingDate,
      priceNight:   Number(this.form.priceNight),
      typeRental:   this.form.typeRental
    };

    if (this.editingId) {
      this.houseSvc.updateRentalPackage(this.ownerId!, this.editingId, payload).subscribe({
        next: (res) => {
          const idx = this.packages.findIndex(p => p.id === this.editingId);
          if (idx !== -1 && res?.data) this.packages[idx] = res.data;
          this.toastr.success('Paquete actualizado correctamente', '¡Éxito!');
          this.isSaving = false;
          this.cancelForm();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message ?? 'Error al actualizar', 'Error');
          this.isSaving = false;
        }
      });
    } else {
      this.houseSvc.addRentalPackage(this.ownerId!, this.houseId!, payload).subscribe({
        next: (res) => {
          if (res?.data) this.packages = [res.data, ...this.packages];
          this.toastr.success('Paquete creado correctamente', '¡Éxito!');
          this.isSaving = false;
          this.cancelForm();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message ?? 'Error al crear el paquete', 'Error');
          this.isSaving = false;
        }
      });
    }
  }

  deletePackage(id: string): void {
    if (!confirm('¿Eliminar este paquete de alquiler?')) return;

    this.houseSvc.deleteRentalPackage(this.ownerId!, id).subscribe({
      next: () => {
        this.packages = this.packages.filter(p => p.id !== id);
        this.toastr.success('Paquete eliminado', '¡Eliminado!');
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Error al eliminar', 'Error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-houses']);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date + 'T00:00:00').toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getDurationDays(start: string, end: string): number {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  getRentalTypeLabel(type: string): string {
    const map: Record<string, string> = {
      ENTIRE_HOUSE: '🏠 Casa completa',
      ROOMS: '🛏️ Por habitaciones',
      BOTH: '✨ Ambas opciones'
    };
    return map[type] ?? type;
  }

  getRentalTypeClass(type: string): string {
    const map: Record<string, string> = {
      ENTIRE_HOUSE: 'bg-blue-50 text-blue-700',
      ROOMS: 'bg-purple-50 text-purple-700',
      BOTH: 'bg-green-50 text-green-700'
    };
    return map[type] ?? 'bg-gray-100 text-gray-600';
  }
}