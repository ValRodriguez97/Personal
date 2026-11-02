import { DOCUMENT } from '@angular/common';
import {
  HttpErrorResponse,
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, filter, from, map, mergeMap, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  ArchivoDescargado,
  EstadoExportacion,
  extensionDe,
  FiltrosReporte,
  FormatoReporte,
  ResultadoImpresion,
  ResultadoTelemetria,
  TipoReporte,
} from '../models/reporte.models';

const MENSAJE_GENERICO = 'No pudimos exportar el reporte. Inténtalo de nuevo.';

/** Error de exportación con la clasificación exacta que se reporta al backend. */
export class ErrorReporte extends Error {
  constructor(
    message: string,
    readonly resultado: ResultadoTelemetria,
  ) {
    super(message);
    this.name = 'ErrorReporte';
  }
}

/** Cliente de exportación de reportes (US-16). El alcance (tienda propia o plataforma) lo decide el token. */
@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly http = inject(HttpClient);
  private readonly documento = inject(DOCUMENT);
  private readonly base = `${environment.apiUrl}/v1/reportes`;

  exportar(
    tipo: TipoReporte,
    filtros: FiltrosReporte,
    formato: FormatoReporte = 'PDF',
  ): Observable<EstadoExportacion> {
    return this.http
      .get(`${this.base}/${tipo}`, {
        params: this.params(filtros, formato),
        responseType: 'blob',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        map((evento) => this.aEstado(evento, tipo, formato)),
        filter((estado): estado is EstadoExportacion => estado !== null),
        catchError((err: unknown) =>
          from(this.detalleError(err)).pipe(
            mergeMap(({ mensaje, resultado }) => throwError(() => new ErrorReporte(mensaje, resultado))),
          ),
        ),
      );
  }

  /** Guarda el archivo con un enlace temporal. El objeto URL se libera después de que el navegador lo use. */
  descargar(archivo: ArchivoDescargado): void {
    const url = URL.createObjectURL(archivo.blob);
    const enlace = this.documento.createElement('a');
    enlace.href = url;
    enlace.download = archivo.nombre;
    this.documento.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  /**
   * Imprime el PDF desde un iframe oculto. Es la vía principal porque no depende de popups.
   *
   * <p>Si el iframe no carga en 3 segundos o el navegador no permite imprimirlo, se usa la ventana
   * de respaldo que el componente abrió dentro del clic (así no la bloquea el navegador). El iframe
   * y el objeto URL se liberan con {@code afterprint} o con un temporizador de seguridad.</p>
   */
  imprimir(archivo: ArchivoDescargado, ventana: Window | null): Promise<ResultadoImpresion> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(archivo.blob);
      const iframe = this.documento.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');
      iframe.style.position = 'fixed';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      iframe.src = url;

      let finalizado = false;
      let cargado = false;
      let temporizadorCarga: ReturnType<typeof setTimeout>;

      const finalizar = (resultado: ResultadoImpresion, conservarUrl: boolean) => {
        if (finalizado) return;
        finalizado = true;
        clearTimeout(temporizadorCarga);
        iframe.remove();
        if (conservarUrl) {
          setTimeout(() => URL.revokeObjectURL(url), 60_000);
        } else {
          URL.revokeObjectURL(url);
        }
        resolve(resultado);
      };

      const usarVentanaDeRespaldo = () => {
        if (ventana && !ventana.closed) {
          ventana.location.href = url;
          finalizar('pestana', true);
        } else {
          finalizar('sin-ventana', false);
        }
      };

      temporizadorCarga = setTimeout(() => {
        if (!cargado) usarVentanaDeRespaldo();
      }, 3_000);

      iframe.onload = () => {
        if (finalizado) return;
        cargado = true;
        clearTimeout(temporizadorCarga);
        const contenido = iframe.contentWindow;
        if (!contenido) {
          usarVentanaDeRespaldo();
          return;
        }
        const cerrar = () => finalizar('impreso', false);
        contenido.addEventListener?.('afterprint', cerrar, { once: true });
        setTimeout(cerrar, 10_000);
        try {
          contenido.focus();
          contenido.print();
          if (ventana && !ventana.closed) {
            setTimeout(() => ventana.close(), 0);
          }
        } catch {
          usarVentanaDeRespaldo();
        }
      };
      iframe.onerror = usarVentanaDeRespaldo;

      this.documento.body.appendChild(iframe);
    });
  }

  /**
   * Telemetría de RNF-24. Es "fire and forget": un fallo de red al reportar nunca debe afectar al
   * usuario ni cambiar el resultado de la descarga. El contrato viaja en minúsculas.
   */
  reportarExportacion(
    tipo: TipoReporte,
    formato: FormatoReporte,
    resultado: ResultadoTelemetria,
    motivo?: string,
  ): void {
    this.http
      .post(`${this.base}/telemetria`, {
        tipo,
        formato,
        resultado: resultado.toLowerCase(),
        motivo: motivo ?? null,
      })
      .subscribe({ error: () => undefined });
  }

  private aEstado(
    evento: HttpEvent<Blob>,
    tipo: TipoReporte,
    formato: FormatoReporte,
  ): EstadoExportacion | null {
    switch (evento.type) {
      case HttpEventType.Sent:
        return { fase: 'generando' };
      case HttpEventType.ResponseHeader:
        return { fase: 'descargando', progreso: null };
      case HttpEventType.DownloadProgress:
        return {
          fase: 'descargando',
          progreso: evento.total ? Math.min(100, Math.round((evento.loaded * 100) / evento.total)) : null,
        };
      case HttpEventType.Response: {
        const blob = evento.body;
        if (!blob || blob.size === 0) {
          throw new ErrorReporte(
            'El servidor devolvió un archivo vacío. Inténtalo de nuevo.',
            'BLOB_VACIO',
          );
        }
        const nombre = this.nombreDe(evento.headers.get('Content-Disposition'), tipo, formato);
        return { fase: 'listo', archivo: { blob, nombre } };
      }
      default:
        return null;
    }
  }

  private nombreDe(cabecera: string | null, tipo: TipoReporte, formato: FormatoReporte): string {
    const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(cabecera ?? '');
    if (utf8) return decodeURIComponent(utf8[1]);
    const simple = /filename="?([^";]+)"?/i.exec(cabecera ?? '');
    return simple?.[1] ?? `reporte-${tipo}.${extensionDe(formato)}`;
  }

  /** Con `responseType: 'blob'` el cuerpo de un error llega como Blob: hay que leerlo para ver el mensaje. */
  private async detalleError(
    err: unknown,
  ): Promise<{ mensaje: string; resultado: ResultadoTelemetria }> {
    if (err instanceof ErrorReporte) {
      return { mensaje: err.message, resultado: err.resultado };
    }
    if (!(err instanceof HttpErrorResponse)) {
      return {
        mensaje: err instanceof Error ? err.message : MENSAJE_GENERICO,
        resultado: 'ERROR_CLIENTE',
      };
    }
    if (err.status === 0) {
      return {
        mensaje: 'No hay conexión con el servidor. Revisa tu red e inténtalo de nuevo.',
        resultado: 'ERROR_RED',
      };
    }
    if (err.status === 401 || err.status === 403) {
      return {
        mensaje: 'No tienes permiso para exportar este reporte.',
        resultado: 'ERROR_CLIENTE',
      };
    }
    if (err.error instanceof Blob && err.status < 500) {
      try {
        const cuerpo = JSON.parse(await err.error.text());
        if (typeof cuerpo?.mensaje === 'string') {
          return { mensaje: cuerpo.mensaje, resultado: 'ERROR_CLIENTE' };
        }
      } catch {
        /* el cuerpo no era JSON */
      }
    }
    return {
      mensaje:
        err.status >= 500
          ? 'No pudimos generar el reporte. Inténtalo de nuevo en unos minutos.'
          : MENSAJE_GENERICO,
      resultado: 'ERROR_CLIENTE',
    };
  }

  private params(f: FiltrosReporte, formato: FormatoReporte): HttpParams {
    let params = new HttpParams().set('formato', formato);
    if (f.startDate) params = params.set('startDate', f.startDate);
    if (f.endDate) params = params.set('endDate', f.endDate);
    if (f.categoria) params = params.set('categoria', f.categoria);
    return params;
  }
}
