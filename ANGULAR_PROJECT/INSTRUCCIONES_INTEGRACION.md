# 📘 Guía de Integración - Rural Rental Angular

## 🎯 Objetivo

Integrar las páginas de Login y Registro de Rural Rental en tu proyecto Angular existente.

## 📂 Archivos Proporcionados

Dentro de la carpeta `/ANGULAR_PROJECT/` encontrarás la estructura completa de un proyecto Angular:

```
ANGULAR_PROJECT/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/           ← Componente de Login
│   │   │   └── register/        ← Componente de Registro
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.css               ← Estilos globales con Tailwind
│   ├── index.html
│   └── main.ts
├── package.json                 ← Dependencias necesarias
├── angular.json                 ← Configuración de Angular
├── tailwind.config.js          ← Configuración de Tailwind
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md                    ← Documentación completa
```

## 🚀 Opción 1: Proyecto Nuevo (Recomendado)

Si estás empezando desde cero:

### 1. Crear directorio del proyecto

```bash
mkdir rural-rental-angular
cd rural-rental-angular
```

### 2. Copiar TODOS los archivos

Copia toda la carpeta `/ANGULAR_PROJECT/` a tu directorio.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar

```bash
ng serve
```

¡Listo! Tu aplicación estará corriendo en `http://localhost:4200`

## 🔧 Opción 2: Proyecto Angular Existente

Si ya tienes un proyecto Angular y quieres integrar estas páginas:

### 1. Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### 2. Configurar Tailwind

**Copia el archivo:** `/ANGULAR_PROJECT/tailwind.config.js` → Tu proyecto

**Actualiza `src/styles.css`:**
```css


/* ... resto de estilos de /ANGULAR_PROJECT/src/styles.css ... */
```

### 3. Instalar ngx-toastr

```bash
npm install ngx-toastr
npm install @angular/animations
```

**Actualiza `angular.json`:**
```json
"styles": [
  "src/styles.css",
  "node_modules/ngx-toastr/toastr.css"
]
```

### 4. Copiar componentes

```bash
# Crear directorio pages si no existe
mkdir -p src/app/pages

# Copiar componentes
cp -r /ANGULAR_PROJECT/src/app/pages/login src/app/pages/
cp -r /ANGULAR_PROJECT/src/app/pages/register src/app/pages/
```

### 5. Actualizar app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    })
  ]
};
```

### 6. Actualizar app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login - Rural Rental'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Crear Cuenta - Rural Rental'
  },
  // ... tus otras rutas ...
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
```

### 7. Actualizar app.component.ts

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {
  title = 'rural-rental';
}
```

### 8. Ejecutar el proyecto

```bash
ng serve
```

## 🔍 Verificación

Accede a estas rutas para verificar:

- **Login:** `http://localhost:4200/`
- **Registro:** `http://localhost:4200/register`

## ✅ Checklist de Integración

- [ ] Tailwind CSS instalado y configurado
- [ ] ngx-toastr instalado
- [ ] Estilos de toastr agregados a angular.json
- [ ] Fuentes de Google importadas en styles.css
- [ ] Componentes copiados a `/src/app/pages/`
- [ ] app.config.ts actualizado con providers
- [ ] app.routes.ts actualizado con rutas
- [ ] app.component.ts usando RouterOutlet
- [ ] `ng serve` ejecutándose sin errores

## 🎨 Personalización Post-Integración

### Cambiar la ruta de login

Si quieres que el login esté en `/login` en lugar de `/`:

```typescript
// app.routes.ts
{
  path: 'login',
  component: LoginComponent
},
{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
}
```

### Integrar con tu servicio de autenticación

Crea un servicio:

```bash
ng generate service services/auth
```

**auth.service.ts:**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://tu-api.com';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
```

**Actualiza login.component.ts:**
```typescript
import { AuthService } from '../../services/auth.service';

constructor(
  private router: Router, 
  private toastr: ToastrService,
  private authService: AuthService
) {}

async onSubmit(): Promise<void> {
  // Validaciones...
  
  this.isLoading = true;
  
  this.authService.login(this.formData).subscribe({
    next: (response) => {
      this.toastr.success('Bienvenido!', 'Login exitoso');
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      this.toastr.error('Credenciales inválidas', 'Error');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
```

No olvides agregar `provideHttpClient()`:

```typescript
// app.config.ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({...}),
    provideHttpClient() // ← Agregar
  ]
};
```

### Agregar Guard de autenticación

```bash
ng generate guard guards/auth
```

**auth.guard.ts:**
```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.navigate(['/']);
    return false;
  }
  
  return true;
};
```

**Proteger rutas:**
```typescript
// app.routes.ts
import { authGuard } from './guards/auth.guard';

{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

## 🐛 Solución de Problemas Comunes

### Error: "Module not found: @angular/forms"

```bash
npm install @angular/forms
```

### Error: "Can't resolve 'ngx-toastr'"

```bash
npm install ngx-toastr @angular/animations
```

### Tailwind no aplica estilos

1. Verifica `tailwind.config.js` en la raíz
2. Reinicia el servidor: `Ctrl+C` → `ng serve`
3. Limpia caché: `rm -rf .angular`

### Toastr no aparece

1. Verifica que `provideAnimations()` esté en app.config.ts
2. Confirma que los estilos estén en angular.json
3. Revisa la consola por errores

### Errores de TypeScript

Asegúrate de que tu `tsconfig.json` tiene:
```json
{
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": false
  }
}
```

## 📚 Recursos Adicionales

- **Angular Docs:** https://angular.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **ngx-toastr:** https://www.npmjs.com/package/ngx-toastr
- **Angular Router:** https://angular.io/guide/router

## 📞 Soporte

Si encuentras problemas durante la integración:

1. Revisa la consola del navegador (F12)
2. Revisa los errores de compilación en la terminal
3. Consulta el archivo `README.md` para más detalles
4. Verifica que todas las dependencias estén instaladas

## 🎉 ¡Éxito!

Si llegaste hasta aquí y todo funciona, ¡felicitaciones! Tienes completamente integradas las páginas de Login y Registro de Rural Rental en tu proyecto Angular.

### Próximos pasos recomendados:

1. ✅ Integrar con tu API backend
2. ✅ Agregar guards de autenticación
3. ✅ Implementar manejo de tokens (JWT)
4. ✅ Agregar tests unitarios
5. ✅ Configurar variables de entorno
6. ✅ Deploy a producción

¡Buena suerte con tu proyecto! 🚀
