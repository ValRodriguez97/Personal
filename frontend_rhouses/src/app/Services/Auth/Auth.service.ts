import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface LoggedUser {
  id: string;
  userName: string;
  accountType: 'customer' | 'owner';
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'rhouses_user';

  // Signal reactivo con el usuario actual
  private _user = signal<LoggedUser | null>(this.loadFromStorage());

  // Señales derivadas públicas
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isOwner = computed(() => this._user()?.accountType === 'owner');
  readonly userInitial = computed(() => {
    const u = this._user();
    return u ? u.userName.charAt(0).toUpperCase() : '';
  });

  constructor(private router: Router) {}

  login(user: LoggedUser): void {
    this._user.set(user);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this._user.set(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/']);
  }

  private loadFromStorage(): LoggedUser | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}