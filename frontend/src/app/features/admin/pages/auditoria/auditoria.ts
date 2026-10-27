import { Component, OnInit, inject, signal } from '@angular/core';

import { Navbar } from '../../../../shared/components/navbar/navbar';
import { procesarErrorApi } from '../../../auth/auth.validators';
import {
  ETIQUETAS_RESULTADO,
  FiltrosAuditoria,
  Pagina,
  RegistroAuditoria,
  RespuestaIntegridad,
} from '../../models/admin.models';
import { AuditoriaService } from '../../services/auditoria.service';

/**
 * US-14: visor de solo lectura de la auditoría con filtros, paginación y
 * verificación de la integridad de la cadena de hashes.
 * @see US-14
 * @see RNF-17
 */
@Component({
  selector: 'app-auditoria',
  imports: [Navbar],
  templateUrl: './auditoria.html',
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
    .admin-paginado {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.25rem;
      color: var(--ls-muted);
      font-size: 0.9rem;
    }
    .hash-celda {
      font-family: monospace;
      font-size: 0.78rem;
      color: var(--ls-muted);
      word-break: break-all;
    }
    .chip-FALLO {
      background: var(--ls-error-soft);
      color: var(--ls-error);
    }
    .chip-INTEGRIDAD-MALA {
      background: var(--ls-error-soft);
      color: var(--ls-error);
    }
  `,
})
export class AuditoriaPage implements OnInit {
  private readonly auditoria = inject(AuditoriaService);

  protected readonly etiquetasResultado = ETIQUETAS_RESULTADO;

  protected readonly filtroEmail = signal('');
  protected readonly filtroAccion = signal('');
  protected readonly filtroTipoEntidad = signal('');
  protected readonly filtroEntidadId = signal('');

  protected readonly items = signal<RegistroAuditoria[]>([]);
  protected readonly pagina = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly totalElementos = signal(0);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly integridad = signal<RespuestaIntegridad | null>(null);
  protected readonly integridadCargando = signal(false);
  protected readonly errorIntegridad = signal<string | null>(null);

  /**
   * Carga la primera página del visor al iniciar.
   * @returns No devuelve un valor.
   */
  ngOnInit(): void {
    this.cargar();
  }

  /**
   * Consulta los registros de auditoría con los filtros vigentes.
   * @returns No devuelve un valor.
   * @see US-14
   */
  protected cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const entidadId = this.filtroEntidadId().trim();
    const filtros: FiltrosAuditoria = {
      adminEmail: this.filtroEmail().trim() || undefined,
      accion: this.filtroAccion().trim() || undefined,
      tipoEntidad: this.filtroTipoEntidad().trim() || undefined,
      entidadId: entidadId === '' || Number.isNaN(Number(entidadId)) ? undefined : Number(entidadId),
      pagina: this.pagina(),
      tamano: 10,
    };
    this.auditoria.listar(filtros).subscribe({
      next: (res: Pagina<RegistroAuditoria>) => {
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
   * Aplica los filtros y vuelve a la primera página.
   * @returns No devuelve un valor.
   */
  protected aplicarFiltros(): void {
    this.pagina.set(0);
    this.cargar();
  }

  /**
   * Limpia los filtros y recarga el visor.
   * @returns No devuelve un valor.
   */
  protected limpiarFiltros(): void {
    this.filtroEmail.set('');
    this.filtroAccion.set('');
    this.filtroTipoEntidad.set('');
    this.filtroEntidadId.set('');
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
   * Verifica la integridad de la cadena de hashes y muestra el resultado.
   * @returns No devuelve un valor.
   * @see US-14
   */
  protected verificarIntegridad(): void {
    this.integridadCargando.set(true);
    this.errorIntegridad.set(null);
    this.integridad.set(null);
    this.auditoria.verificarIntegridad().subscribe({
      next: (res) => {
        this.integridad.set(res);
        this.integridadCargando.set(false);
      },
      error: (err: unknown) => {
        this.errorIntegridad.set(procesarErrorApi(err));
        this.integridadCargando.set(false);
      },
    });
  }

  /**
   * Recorta un hash para presentarlo en la tabla sin romper el ancho.
   * @param hash Hash completo del registro.
   * @returns Versión recortada con elipsis.
   */
  protected hashCorto(hash: string): string {
    return hash.length > 12 ? `${hash.slice(0, 12)}…` : hash;
  }
}
