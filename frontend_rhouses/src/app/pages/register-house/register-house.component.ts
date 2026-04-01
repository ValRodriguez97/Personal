import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/Auth/Auth.service';
import { NavbarComponent } from '../homepage/components/navbar/navbar.component';

interface BedroomForm {
  bedroomCode: number | null;
  bathroom: boolean;
  numberBeds: number;
  typesOfBeds: string[];
}

interface KitchenForm {
  idCocina: string;
  dishWasher: boolean;
  washingMachine: boolean;
}

interface PhotoForm {
  url: string;
  description: string;
}

interface HouseForm {
  code: string;
  description: string;
  privateBathrooms: number;
  publicBathrooms: number;
  garagePlaces: number;
  populationName: string;
  bedrooms: BedroomForm[];
  diningRooms: KitchenForm[];
  photo: PhotoForm[];
}

@Component({
  selector: 'app-register-house',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './register-house.component.html',
  styleUrls: ['./register-house.component.css']
})
export class RegisterHouseComponent {
  private router  = inject(Router);
  private toastr  = inject(ToastrService);
  private http    = inject(HttpClient);
  authService     = inject(AuthService);

  private readonly apiUrl = 'http://localhost:8081/api/houses';

  step = 1;
  isLoading = false;

  form: HouseForm = {
    code: '',
    description: '',
    privateBathrooms: 1,
    publicBathrooms: 1,
    garagePlaces: 0,
    populationName: '',
    bedrooms: [],
    diningRooms: [],
    photo: []
  };

  errors: Record<string, string> = {};

  get progressWidth(): number { return (this.step / 4) * 100; }
  get stepTitle(): string {
    return ['', 'Información general', 'Habitaciones', 'Cocinas y fotos', 'Confirmar y registrar'][this.step];
  }

  // ── Habitaciones ─────────────────────────────────────────────────────────

  addBedroom(): void {
    this.form.bedrooms.push({
      bedroomCode: null,
      bathroom: false,
      numberBeds: 1,
      typesOfBeds: ['SIMPLE']
    });
  }

  removeBedroom(index: number): void {
    this.form.bedrooms.splice(index, 1);
  }

  updateBedTypes(bedroom: BedroomForm, count: number): void {
    const current = bedroom.typesOfBeds.length;
    if (count > current) {
      for (let i = current; i < count; i++) bedroom.typesOfBeds.push('SIMPLE');
    } else {
      bedroom.typesOfBeds = bedroom.typesOfBeds.slice(0, count);
    }
    bedroom.numberBeds = count;
  }

  setBedType(bedroom: BedroomForm, index: number, type: string): void {
    bedroom.typesOfBeds[index] = type;
  }

  // ── Cocinas ──────────────────────────────────────────────────────────────

  addKitchen(): void {
    this.form.diningRooms.push({
      idCocina: `COC-${Date.now()}`,
      dishWasher: false,
      washingMachine: false
    });
  }

  removeKitchen(index: number): void {
    this.form.diningRooms.splice(index, 1);
  }

  // ── Fotos ─────────────────────────────────────────────────────────────────

  addPhoto(): void {
    this.form.photo.push({ url: '', description: '' });
  }

  removePhoto(index: number): void {
    this.form.photo.splice(index, 1);
  }

  // ── Navegación ───────────────────────────────────────────────────────────

  onNext(): void {
    this.errors = {};

    if (this.step === 1) {
      if (!this.validateStep1()) return;
      this.step = 2;
      if (this.form.bedrooms.length === 0) {
        this.addBedroom(); this.addBedroom(); this.addBedroom();
      }
    } else if (this.step === 2) {
      if (!this.validateStep2()) return;
      this.step = 3;
      if (this.form.diningRooms.length === 0) this.addKitchen();
    } else if (this.step === 3) {
      if (!this.validateStep3()) return;
      this.step = 4;
    } else if (this.step === 4) {
      this.submit();
    }
  }

  onBack(): void {
    if (this.step > 1) { this.step--; this.errors = {}; }
  }

  // ── Validaciones ─────────────────────────────────────────────────────────

  validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!this.form.code.trim())           e['code']           = 'El código es obligatorio';
    if (!this.form.populationName.trim()) e['populationName'] = 'La población es obligatoria';
    const totalBaths = this.form.privateBathrooms + this.form.publicBathrooms;
    if (totalBaths < 2) e['bathrooms'] = 'La casa debe tener al menos 2 baños en total';
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (this.form.bedrooms.length < 3)
      e['bedrooms'] = 'Debes añadir al menos 3 habitaciones';

    const codes = this.form.bedrooms.map(b => b.bedroomCode);
    const hasDuplicates = codes.some((c, i) => codes.indexOf(c) !== i);
    if (hasDuplicates) e['bedroomCodes'] = 'Los códigos de habitación deben ser únicos';

    const hasNull = this.form.bedrooms.some(b => b.bedroomCode === null);
    if (hasNull) e['bedroomNull'] = 'Todas las habitaciones deben tener un código';

    this.errors = e;
    return Object.keys(e).length === 0;
  }

  validateStep3(): boolean {
    const e: Record<string, string> = {};
    if (this.form.diningRooms.length < 1)
      e['kitchens'] = 'Debes añadir al menos 1 cocina';

    const invalidPhotos = this.form.photo.filter(p => p.url.trim() === '');
    if (invalidPhotos.length > 0)
      e['photos'] = 'Todas las fotos añadidas deben tener una URL';

    this.errors = e;
    return Object.keys(e).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  submit(): void {
    const ownerId = this.authService.user()?.id;
    if (!ownerId) {
      this.toastr.error('Debes iniciar sesión como propietario', 'Sin sesión');
      return;
    }

    this.isLoading = true;

    const payload = {
      code:             this.form.code.trim(),
      description:      this.form.description.trim(),
      privateBathrooms: this.form.privateBathrooms,
      publicBathrooms:  this.form.publicBathrooms,
      garagePlaces:     this.form.garagePlaces,
      populationName:   this.form.populationName.trim(),
      bedrooms: this.form.bedrooms.map(b => ({
        bedroomCode:  b.bedroomCode,
        bathroom:     b.bathroom,
        numberBeds:   b.numberBeds,
        typesOfBeds:  b.typesOfBeds
      })),
      diningRooms: this.form.diningRooms.map(k => ({
        idCocina:       k.idCocina,
        dishWasher:     k.dishWasher,
        washingMachine: k.washingMachine
      })),
      photo: this.form.photo
        .filter(p => p.url.trim())
        .map(p => ({ url: p.url.trim(), description: p.description.trim() }))
    };

    this.http.post(`${this.apiUrl}?ownerId=${ownerId}`, payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Casa rural registrada correctamente', '¡Éxito!');
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Error al registrar la casa';
        this.toastr.error(msg, 'Error');
        this.isLoading = false;
      }
    });
  }

  bedRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
