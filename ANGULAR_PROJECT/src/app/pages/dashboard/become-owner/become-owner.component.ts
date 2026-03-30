import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface UpgradeForm {
  reason: string;
  propertyCount: string;
  securityKey: string;
  confirmSecurityKey: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  reason?: string;
  propertyCount?: string;
  securityKey?: string;
  confirmSecurityKey?: string;
  agreeToTerms?: string;
}

@Component({
  selector: 'app-become-owner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './become-owner.component.html',
  styleUrls: ['./become-owner.component.css']
})
export class BecomeOwnerComponent {
  step = 1;
  isLoading = false;
  showSecurityKey = false;
  showConfirmSecurityKey = false;

  formData: UpgradeForm = {
    reason: '',
    propertyCount: '',
    securityKey: '',
    confirmSecurityKey: '',
    agreeToTerms: false
  };

  errors: FormErrors = {};

  benefits = [
    {
      icon: 'home_work',
      title: 'Publica Propiedades',
      description: 'Sube tus cabañas y casas rurales a la plataforma'
    },
    {
      icon: 'payments',
      title: 'Recibe Pagos',
      description: 'Cobra directamente por tus reservas'
    },
    {
      icon: 'analytics',
      title: 'Análisis Detallados',
      description: 'Accede a estadísticas de tus propiedades'
    },
    {
      icon: 'support_agent',
      title: 'Soporte Prioritario',
      description: 'Atención personalizada 24/7'
    },
    {
      icon: 'verified',
      title: 'Verificación Premium',
      description: 'Badge verificado en tu perfil'
    },
    {
      icon: 'schedule',
      title: 'Gestión de Calendario',
      description: 'Control total de disponibilidad'
    }
  ];

  reasons = [
    { value: 'tengo-propiedades', label: 'Tengo propiedades para alquilar' },
    { value: 'amplio-negocio', label: 'Quiero ampliar mi negocio' },
    { value: 'ingresos-extra', label: 'Busco generar ingresos extra' },
    { value: 'emprender', label: 'Quiero emprender en turismo rural' },
    { value: 'otro', label: 'Otro motivo' }
  ];

  constructor(private router: Router, private toastr: ToastrService) {}

  get progressWidth(): number {
    return (this.step / 3) * 100;
  }

  get stepTitle(): string {
    switch (this.step) {
      case 1:
        return '¿Por qué quieres ser propietario?';
      case 2:
        return 'Crea tu clave de seguridad';
      case 3:
        return 'Confirma tu upgrade';
      default:
        return '';
    }
  }

  onInputChange(field: keyof FormErrors): void {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  validateStep1(): FormErrors {
    const newErrors: FormErrors = {};

    if (!this.formData.reason) {
      newErrors.reason = 'Por favor selecciona una razón';
    }

    if (!this.formData.propertyCount) {
      newErrors.propertyCount = 'Indica cuántas propiedades planeas publicar';
    } else if (parseInt(this.formData.propertyCount) < 1) {
      newErrors.propertyCount = 'Debe ser al menos 1 propiedad';
    }

    return newErrors;
  }

  validateStep2(): FormErrors {
    const newErrors: FormErrors = {};

    if (!this.formData.securityKey) {
      newErrors.securityKey = 'La clave de seguridad es requerida';
    } else if (this.formData.securityKey.length < 8) {
      newErrors.securityKey = 'La clave debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(this.formData.securityKey)) {
      newErrors.securityKey = 'Debe contener al menos una mayúscula';
    } else if (!/[0-9]/.test(this.formData.securityKey)) {
      newErrors.securityKey = 'Debe contener al menos un número';
    } else if (!/[!@#$%^&*]/.test(this.formData.securityKey)) {
      newErrors.securityKey = 'Debe contener al menos un carácter especial (!@#$%^&*)';
    }

    if (!this.formData.confirmSecurityKey) {
      newErrors.confirmSecurityKey = 'Confirma tu clave de seguridad';
    } else if (this.formData.securityKey !== this.formData.confirmSecurityKey) {
      newErrors.confirmSecurityKey = 'Las claves no coinciden';
    }

    return newErrors;
  }

  validateStep3(): FormErrors {
    const newErrors: FormErrors = {};

    if (!this.formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Debes aceptar los términos y condiciones';
    }

    return newErrors;
  }

  async onNext(): Promise<void> {
    let newErrors: FormErrors = {};

    if (this.step === 1) {
      newErrors = this.validateStep1();
    } else if (this.step === 2) {
      newErrors = this.validateStep2();
    } else if (this.step === 3) {
      newErrors = this.validateStep3();
    }

    if (Object.keys(newErrors).length > 0) {
      this.errors = newErrors;
      return;
    }

    this.isLoading = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (this.step < 3) {
        this.step++;
        this.toastr.success('Continúa con el siguiente paso', `Paso ${this.step - 1} completado`);
      } else {
        // Upgrade completo
        this.toastr.success(
          '¡Ahora puedes publicar tus propiedades!',
          '¡Bienvenido como Propietario! 🎉'
        );
        console.log('Owner upgrade complete:', this.formData);
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      }
    } catch (error) {
      this.toastr.error('Por favor intenta nuevamente', 'Error al procesar');
    } finally {
      this.isLoading = false;
    }
  }

  onBack(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  toggleSecurityKeyVisibility(): void {
    this.showSecurityKey = !this.showSecurityKey;
  }

  toggleConfirmSecurityKeyVisibility(): void {
    this.showConfirmSecurityKey = !this.showConfirmSecurityKey;
  }

  generateSecurityKey(): void {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let key = '';
    
    // Asegurar al menos uno de cada tipo
    key += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Mayúscula
    key += '0123456789'[Math.floor(Math.random() * 10)]; // Número
    key += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Especial
    
    // Rellenar el resto
    for (let i = key.length; i < length; i++) {
      key += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar
    key = key.split('').sort(() => Math.random() - 0.5).join('');
    
    this.formData.securityKey = key;
    this.formData.confirmSecurityKey = key;
    this.showSecurityKey = true;
    this.showConfirmSecurityKey = true;
    
    this.toastr.info('Clave generada automáticamente', 'Guárdala en un lugar seguro');
  }

  getSecurityStrength(): { text: string; color: string; width: number } {
    const key = this.formData.securityKey;
    if (!key) return { text: '', color: '', width: 0 };

    let strength = 0;
    if (key.length >= 8) strength++;
    if (key.length >= 12) strength++;
    if (/[a-z]/.test(key) && /[A-Z]/.test(key)) strength++;
    if (/[0-9]/.test(key)) strength++;
    if (/[!@#$%^&*]/.test(key)) strength++;

    if (strength <= 2) {
      return { text: 'Débil', color: 'bg-red-500', width: 33 };
    } else if (strength <= 4) {
      return { text: 'Media', color: 'bg-yellow-500', width: 66 };
    } else {
      return { text: 'Fuerte', color: 'bg-green-500', width: 100 };
    }
  }
}
