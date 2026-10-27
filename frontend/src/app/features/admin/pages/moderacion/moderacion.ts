import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';

import { Navbar } from '../../../../shared/components/navbar/navbar';
import { procesarErrorApi } from '../../../auth/auth.validators';
import {
  ETIQUETAS_ESTADO_PRENDA,
  ETIQUETAS_MODERACION,
  EstadoModeracion,
  EstadoPrenda,
  FiltrosModeracion,
  Pagina,
  PrendaAdmin,
  PrendaAdminDetalle,
} from '../../models/admin.models';
import { ModeracionService } from '../../services/moderacion.service';
import { formatearPrecio } from '../../../catalogoCompras/models/prenda-opciones';

/** Estados de moderación que pueden mostrarse en el filtro. */
const ESTADOS_MODERACION: EstadoModeracion[] = ['SIN_REVISAR', 'APROBADA', 'DESACTIVADA'];

/**
 * US-14: cola de moderación de prendas con filtros, detalle completo y acciones
 * de aprobación, desactivación con motivo y restauración.
 * @see US-14
 */
@Component({
  selector: 'app-moderacion',
  imports: [Navbar],
  templateUrl: './moderacion.html',
  styles: `
    .admin-filtros {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .admin-filtros .field {
      flex: 1 1 170px;
      margin-bottom: 0;
    }
    .admin-filtros select {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1.5px solid var(--ls-border);
      border-radius: var(--ls-radius);
      background: #fffef7;
      color: var(--ls-ink);
      font: inherit;
      font-size: 0.97rem;
    }
    .admin-paginado {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.25rem;
      color: var(--ls-muted);
      font-size: 0.9rem;
    }
    .detalle-prenda {
      margin-top: 1.5rem;
    }
    .detalle-prenda dl {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.5rem 1.25rem;
      margin: 1rem 0;
    }
    .detalle-prenda dt {
      color: var(--ls-muted);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .detalle-prenda dd {
      margin: 0;
      font-size: 0.95rem;
    }
    .detalle-prenda ul {
      margin: 0.25rem 0 1rem;
      padding-left: 1.1rem;
      color: var(--ls-muted);
      font-size: 0.9rem;
    }
    .detalle-acciones {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }
    .chip-SIN-REVISAR {
      background: var(--ls-accent);
      color: var(--ls-ink);
    }
    .chip-DESACTIVADA {
      background: var(--ls-error-soft);
      color: var(--ls-error);
    }
  `,
})
export class ModeracionPage implements OnInit {
  private readonly moderacion = inject(ModeracionService);

  protected readonly estadosModeracion = ESTADOS_MODERACION;
  protected readonly etiquetasModeracion = ETIQUETAS_MODERACION;
  protected readonly etiquetasPrenda = ETIQUETAS_ESTADO_PRENDA;
  protected readonly precio = formatearPrecio;

  protected readonly filtroModeracion = signal('');
  protected readonly filtroPrenda = signal('');
  protected readonly filtroTexto = signal('');
  protected readonly filtroVendedor = signal('');

  protected readonly items = signal<PrendaAdmin[]>([]);
  protected readonly pagina = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly totalElementos = signal(0);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly mensaje = signal<string | null>(null);

  /** Prenda seleccionada para el panel de detalle. */
  protected readonly seleccionada = signal<PrendaAdminDetalle | null>(null);
  protected readonly detalleCargando = signal(false);
  protected readonly desactivando = signal(false);
  protected readonly motivoDesactivacion = signal('');
  protected readonly errorDesactivacion = signal<string | null>(null);
  protected readonly envioPendiente = signal(false);
  protected readonly motivoCampo = viewChild<ElementRef<HTMLTextAreaElement>>('motivoDesactivacionCampo');

  /**
   * Carga la primera página de la cola al iniciar.
   * @returns No devuelve un valor.
   */
  ngOnInit(): void {
    this.cargar();
  }

  /**
   * Consulta la cola de moderación con los filtros vigentes.
   * @returns No devuelve un valor.
   * @see US-14
   */
  protected cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const filtros: FiltrosModeracion = {
      estadoModeracion: (this.filtroModeracion() || undefined) as EstadoModeracion | undefined,
      estadoPrenda: (this.filtroPrenda() || undefined) as EstadoPrenda | undefined,
      texto: this.filtroTexto().trim() || undefined,
      vendedorEmail: this.filtroVendedor().trim() || undefined,
      pagina: this.pagina(),
      tamano: 10,
    };
    this.moderacion.listar(filtros).subscribe({
      next: (res: Pagina<PrendaAdmin>) => {
        this.items.set(res.contenido);
        this.pagina.set(res.pagina);
        this.totalPaginas.set(res.totalPaginas);
        this.totalElementos.set(res.totalElementos);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.error.set(procesarErrorApi(err));
        this.cargando.set(false);
      },
    });
  }

  /**
   * Aplica los filtros y vuelve a la primera página de la cola.
   * @returns No devuelve un valor.
   */
  protected aplicarFiltros(): void {
    this.pagina.set(0);
    this.cargar();
  }

  /**
   * Limpia los filtros y recarga la cola.
   * @returns No devuelve un valor.
   */
  protected limpiarFiltros(): void {
    this.filtroModeracion.set('');
    this.filtroPrenda.set('');
    this.filtroTexto.set('');
    this.filtroVendedor.set('');
    this.pagina.set(0);
    this.cargar();
  }

  /**
   * Retrocede una página cuando existe una anterior.
   * @returns No devuelve un valor.
   */
  protected anterior(): void {
    if (this.pagina() > 0) {
      this.pagina.update((p) => p - 1);
      this.cargar();
    }
  }

  /**
   * Avanza una página cuando quedan resultados.
   * @returns No devuelve un valor.
   */
  protected siguiente(): void {
    if (this.pagina() < this.totalPaginas() - 1) {
      this.pagina.update((p) => p + 1);
      this.cargar();
    }
  }

  /**
   * Carga el detalle completo de una prenda en el panel lateral.
   * @param prenda Fila seleccionada de la cola.
   * @returns No devuelve un valor.
   */
  protected verDetalle(prenda: PrendaAdmin): void {
    this.detalleCargando.set(true);
    this.seleccionada.set(null);
    this.moderacion.detalle(prenda.id).subscribe({
      next: (detalle) => {
        this.seleccionada.set(detalle);
        this.detalleCargando.set(false);
      },
      error: (err: unknown) => {
        this.error.set(procesarErrorApi(err));
        this.detalleCargando.set(false);
      },
    });
  }

  /**
   * Cierra el panel de detalle y sus errores pendientes.
   * @returns No devuelve un valor.
   */
  protected cerrarDetalle(): void {
    this.seleccionada.set(null);
    this.motivoDesactivacion.set('');
    this.errorDesactivacion.set(null);
  }

  /**
   * Aprueba la prenda seleccionada.
   * @returns No devuelve un valor.
   * @see US-14
   */
  protected aprobar(): void {
    const prenda = this.seleccionada();
    if (!prenda) return;
    this.envioPendiente.set(true);
    this.moderacion.aprobar(prenda.id).subscribe({
      next: () => this.trasDecision(`La prenda «${prenda.nombre}» fue aprobada.`),
      error: (err: unknown) => {
        this.envioPendiente.set(false);
        this.error.set(procesarErrorApi(err));
      },
    });
  }

  /**
   * Habilita el campo del motivo de desactivación y lo enfoca.
   * @returns No devuelve un valor.
   */
  protected abrirDesactivacion(): void {
    this.desactivando.set(true);
    this.motivoDesactivacion.set('');
    this.errorDesactivacion.set(null);
    setTimeout(() => this.motivoCampo()?.nativeElement.focus());
  }

  /**
   * Desactiva la prenda con el motivo obligatorio (mínimo 10 caracteres).
   * @returns No devuelve un valor.
   * @see US-14
   */
  protected confirmarDesactivacion(): void {
    const prenda = this.seleccionada();
    const motivo = this.motivoDesactivacion().trim();
    if (!prenda) return;
    if (motivo.length < 10) {
      this.errorDesactivacion.set('Escribe un motivo de al menos 10 caracteres.');
      return;
    }
    this.envioPendiente.set(true);
    this.moderacion.desactivar(prenda.id, motivo).subscribe({
      next: () => this.trasDecision(`La prenda «${prenda.nombre}» fue desactivada.`),
      error: (err: unknown) => {
        this.envioPendiente.set(false);
        this.errorDesactivacion.set(procesarErrorApi(err));
      },
    });
  }

  /**
   * Cancela la desactivación pendiente.
   * @returns No devuelve un valor.
   */
  protected cancelarDesactivacion(): void {
    this.desactivando.set(false);
    this.motivoDesactivacion.set('');
    this.errorDesactivacion.set(null);
  }

  /**
   * Restaura una prenda desactivada para que vuelva a ser visible.
   * @returns No devuelve un valor.
   * @see US-14
   */
  protected restaurar(): void {
    const prenda = this.seleccionada();
    if (!prenda) return;
    this.envioPendiente.set(true);
    this.moderacion.restaurar(prenda.id).subscribe({
      next: () => this.trasDecision(`La prenda «${prenda.nombre}» volvió a edición.`),
      error: (err: unknown) => {
        this.envioPendiente.set(false);
        this.error.set(procesarErrorApi(err));
      },
    });
  }

  /**
   * Recarga la cola, cierra el detalle y muestra el aviso tras una decisión.
   * @param aviso Mensaje de retroalimentación visible.
   * @returns No devuelve un valor.
   */
  private trasDecision(aviso: string): void {
    this.envioPendiente.set(false);
    this.desactivando.set(false);
    this.motivoDesactivacion.set('');
    this.errorDesactivacion.set(null);
    this.seleccionada.set(null);
    this.mensaje.set(aviso);
    this.cargar();
  }
}
