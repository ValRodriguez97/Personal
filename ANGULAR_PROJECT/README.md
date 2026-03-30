# 🏡 Rural Rental - Proyecto Angular

Aplicación de login y registro para Rural Rental implementada en **Angular 17+** con **Tailwind CSS** y **Standalone Components**.

## 📁 Estructura del Proyecto

```
ANGULAR_PROJECT/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.css
│   │   │   └── register/
│   │   │       ├── register.component.ts
│   │   │       ├── register.component.html
│   │   │       └── register.component.css
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

## 🚀 Instalación Rápida

### Paso 1: Crear proyecto Angular (si no tienes uno)

```bash
ng new rural-rental
cd rural-rental
```

### Paso 2: Copiar todos los archivos

Copia TODOS los archivos de la carpeta `/ANGULAR_PROJECT/` a la raíz de tu proyecto Angular.

### Paso 3: Instalar dependencias

```bash
npm install
```

### Paso 4: Ejecutar el proyecto

```bash
ng serve
```

Abre tu navegador en `http://localhost:4200`

## ✅ Funcionalidades Implementadas

### 🔐 Login (`/`)
- ✅ **3 Campos principales:** Username, Email, Password
- ✅ **Checkbox "Ingresar como propietario"**
- ✅ **Campo "Palabra de Acceso"** que se desbloquea al marcar el checkbox
- ✅ **Toggle show/hide** para todos los campos de contraseña
- ✅ **Validaciones en tiempo real**
- ✅ **Remember me checkbox**
- ✅ **Login social** (Google, Apple)
- ✅ **Mensajes con Toastr**
- ✅ **Estados de carga**
- ✅ **Diseño responsivo**

###  Registro (`/register`)
- ✅ **Sistema de 3 pasos** completamente funcional
  
**Paso 1 - Información Personal:**
- Full Name
- Email Address
- Phone Number
- Botones de registro social (Google, Facebook)

**Paso 2 - Credenciales de Cuenta:**
- Username
- Password (con toggle show/hide)
- Confirm Password (con toggle show/hide)
- **Checkbox "Crear cuenta como propietario"**
- **Campo "Palabra de Acceso"** (bloqueado hasta marcar checkbox)

**Paso 3 - Confirmación:**
- Resumen de todos los datos ingresados
- Indicador de tipo de cuenta (Usuario/Propietario)
- Mensaje de aceptación de términos

- ✅ **Barra de progreso animada**
- ✅ **Navegación entre pasos** (Back/Continue)
- ✅ **Validaciones por paso**
- ✅ **Notificaciones Toastr**
- ✅ **Diseño completamente responsivo**

## 🎨 Diseño y Estilos

### Colores
- **Primary:** `#2CA58D` / `#2ba692`
- **Accent:** `#AA4465`
- **Neutral Text:** `#333745`
- **Border:** `#E1E5F2`
- **Background Light:** `#f8f6f7`

### Tipografías
- **Be Vietnam Pro** (Login - Display)
- **Inter** (Registro - Body)
- **Material Symbols Outlined** (Iconos)

### Tailwind CSS v3
- Configuración personalizada en `tailwind.config.js`
- Clases utility-first
- Diseño responsivo mobile-first
- Animaciones CSS personalizadas

## 🔧 Tecnologías Utilizadas

- **Angular 17.3.0** - Framework principal
- **TypeScript 5.4.2** - Lenguaje
- **Tailwind CSS 3.4.3** - Estilos
- **ngx-toastr 18.0.0** - Notificaciones toast
- **Standalone Components** - Arquitectura moderna
- **FormsModule** - Template-driven forms
- **Router** - Navegación

## 📝 Configuración de Toastr

El proyecto incluye `ngx-toastr` configurado en `app.config.ts`:

```typescript
provideToastr({
  timeOut: 3000,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  progressBar: true,
  closeButton: true,
})
```

Los estilos de toastr están incluidos en `angular.json`:

```json
"styles": [
  "src/styles.css",
  "node_modules/ngx-toastr/toastr.css"
]
```

## 🛣️ Rutas Configuradas

```typescript
'/' → LoginComponent
'/register' → RegisterComponent
'/**' → Redirect a '/'
```

## 📱 Responsive Design

Todos los componentes son completamente responsivos:
- **Mobile:** < 768px (stack vertical)
- **Tablet:** 768px - 1024px (diseño adaptativo)
- **Desktop:** > 1024px (split screen en login, sidebar en registro)

## 🔐 Validaciones

### Login
- Username: mínimo 3 caracteres
- Email: formato válido (regex)
- Password: mínimo 6 caracteres
- Access Word (si isOwner): mínimo 4 caracteres

### Register
**Paso 1:**
- Full Name: mínimo 3 caracteres
- Email: formato válido (regex)
- Phone: formato válido (regex), mínimo 10 dígitos

**Paso 2:**
- Username: mínimo 3 caracteres
- Password: mínimo 6 caracteres
- Confirm Password: debe coincidir con Password
- Access Word (si isOwner): mínimo 4 caracteres

## 🎯 Características Técnicas

### Standalone Components
```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  // ...
})
```

### Two-way Data Binding
```html
[(ngModel)]="formData.username"
```

### Conditional Rendering
```html
<div *ngIf="formData.isOwner" class="animate-fade-in">
  <!-- Campo accessWord -->
</div>
```

### Dynamic Classes
```html
[class]="'border ' + (errors.email ? 'border-red-500' : 'border-slate-200')"
```

## 🚀 Integración con Backend

Para integrar con tu API backend:

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

async onSubmit(): Promise<void> {
  // Validaciones...
  
  this.isLoading = true;
  try {
    const response = await this.http.post('/api/login', this.formData).toPromise();
    this.toastr.success('Bienvenido!', 'Login exitoso');
    this.router.navigate(['/dashboard']);
  } catch (error) {
    this.toastr.error('Credenciales inválidas', 'Error');
  } finally {
    this.isLoading = false;
  }
}
```

No olvides agregar `provideHttpClient()` en `app.config.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({...}),
    provideHttpClient() // Agregar esto
  ]
};
```

## 📦 Dependencias

### Producción
```json
{
  "@angular/animations": "^17.3.0",
  "@angular/common": "^17.3.0",
  "@angular/compiler": "^17.3.0",
  "@angular/core": "^17.3.0",
  "@angular/forms": "^17.3.0",
  "@angular/platform-browser": "^17.3.0",
  "@angular/platform-browser-dynamic": "^17.3.0",
  "@angular/router": "^17.3.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.14.3",
  "ngx-toastr": "^18.0.0"
}
```

### Desarrollo
```json
{
  "@angular-devkit/build-angular": "^17.3.0",
  "@angular/cli": "^17.3.0",
  "@angular/compiler-cli": "^17.3.0",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.38",
  "tailwindcss": "^3.4.3",
  "typescript": "~5.4.2"
}
```

## 🎨 Personalización

### Cambiar colores
Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      "primary": "#TU_COLOR_AQUI",
      "accent": "#TU_COLOR_AQUI",
    },
  },
}
```

### Agregar nuevos campos
1. Actualiza el interface en el componente `.ts`
2. Inicializa en `formData`
3. Agrega el campo en el template `.html`
4. Añade validación en el método `validate`

## 🐛 Troubleshooting

### Error: "Can't bind to 'ngModel'"
Asegúrate de importar `FormsModule` en el componente:
```typescript
imports: [CommonModule, FormsModule, RouterModule]
```

### Error: "Tailwind classes not working"
1. Verifica que `tailwind.config.js` existe
2. Revisa que `styles.css` tiene las directivas `@tailwind`
3. Reinicia el servidor: `ng serve`

### Error: "Toastr not showing"
1. Verifica que instalaste `ngx-toastr`
2. Confirma que `provideAnimations()` está en `app.config.ts`
3. Revisa que los estilos están en `angular.json`

## 📖 Documentación de Componentes

### LoginComponent
**Inputs:** Ninguno
**Outputs:** Ninguno
**Métodos públicos:**
- `onSubmit()`: Procesa el login
- `togglePasswordVisibility()`: Muestra/oculta password
- `toggleAccessWordVisibility()`: Muestra/oculta access word
- `onSocialLogin(provider)`: Login con redes sociales

### RegisterComponent
**Inputs:** Ninguno
**Outputs:** Ninguno
**Métodos públicos:**
- `onNext()`: Avanza al siguiente paso
- `onBack()`: Retrocede un paso
- `togglePasswordVisibility()`: Muestra/oculta password
- `toggleConfirmPasswordVisibility()`: Muestra/oculta confirm password
- `toggleAccessWordVisibility()`: Muestra/oculta access word
- `onSocialRegister(provider)`: Registro con redes sociales

**Getters:**
- `progressWidth`: Calcula el % de progreso
- `stepTitle`: Retorna el título del paso actual

## 🌐 i18n (Internacionalización)

El proyecto está preparado para i18n. Para agregar múltiples idiomas:

1. Instala el paquete de localización de Angular
2. Extrae textos con `ng extract-i18n`
3. Traduce los archivos `.xlf`
4. Configura en `angular.json`

## 🧪 Testing

Para agregar tests:

```bash
ng test
```

Los archivos `.spec.ts` se pueden crear con:

```bash
ng generate component pages/login --skip-tests=false
```

## 📄 Licencia

Este proyecto es privado para uso interno de Rural Rental.

## 👨‍💻 Autor

Desarrollado con ❤️ para el proyecto Rural Rental

## 🎉 ¡Listo para Usar!

Tu aplicación Angular de Rural Rental está completamente configurada y lista para integrarse en tu proyecto frontend.

Para iniciar:
```bash
npm install
ng serve
```

¡Disfruta codificando! 🚀
