import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { FiltrosAuditoria, Pagina, RegistroAuditoria, RespuestaIntegridad } from '../../../admin/models/admin.models';
import { AuditoriaService } from '../../../admin/services/auditoria.service';
import { AuditoriaPage } from './auditoria';

describe('AuditoriaPage (US-14)', () => {
  let respuesta: Pagina<RegistroAuditoria>;
  let integridadRespuesta: RespuestaIntegridad;
  const listar = vi.fn((_filtros: FiltrosAuditoria) => of(respuesta));
  const verificarIntegridad = vi.fn(() => of(integridadRespuesta));

  const registro: RegistroAuditoria = {
    id: 1,
    fechaHora: '2026-10-21T10:00:00',
    adminId: 2,
    adminEmail: 'admin@littlestyle.com',
    rol: 'ADMINISTRADOR',
    accion: 'ASIGNACION_VENDEDOR',
    tipoEntidad: 'USUARIO',
    entidadId: 3,
    valorAnterior: null,
    valorNuevo: 'VENDEDOR',
    motivo: 'Alta de tienda propia',
    resultado: 'EXITO',
    hash: '1a2b3c4d5e6f7890',
    hashAnterior: null,
  };

  /**
   * Crea el componente con el visor ya cargado.
   * @returns Fixture y elemento raíz para las aserciones.
   */
  function crear() {
    const fixture = TestBed.createComponent(AuditoriaPage);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  beforeEach(async () => {
    respuesta = {
      contenido: [registro],
      pagina: 0,
      tamano: 10,
      totalElementos: 1,
      totalPaginas: 1,
    };
    integridadRespuesta = { totalRegistros: 12, integra: true, primerInconsistenteId: null, detalle: null };
    listar.mockClear();
    verificarIntegridad.mockClear();
    await TestBed.configureTestingModule({
      imports: [AuditoriaPage],
      providers: [
        provideRouter([]),
        { provide: AuditoriaService, useFactory: () => ({ listar, verificarIntegridad }) },
      ],
    }).compileComponents();
  });

  it('lista los registros en solo lectura', () => {
    const { el } = crear();
    expect(el.textContent).toContain('admin@littlestyle.com');
    expect(el.textContent).toContain('ASIGNACION_VENDEDOR');
    expect(el.textContent).toContain('Éxito');
    expect(el.querySelector('.hash-celda')?.textContent).toContain('1a2b3c4d5e6f…');
    expect(el.querySelector('input[type="submit"]')).toBeNull();
  });

  it('aplica los filtros de auditoría', () => {
    const { fixture, el } = crear();
    const accion = el.querySelector<HTMLInputElement>('#filtro-auditoria-accion')!;
    accion.value = 'ASIGNACION_VENDEDOR';
    accion.dispatchEvent(new Event('input'));
    el.querySelector<HTMLButtonElement>('.admin-filtros .btn-primary')!.click();
    fixture.detectChanges();

    expect(listar.mock.calls[listar.mock.calls.length - 1][0]).toMatchObject({
      accion: 'ASIGNACION_VENDEDOR',
    });
  });

  it('verifica la integridad y muestra el resultado íntegro', () => {
    const { fixture, el } = crear();
    el.querySelector<HTMLButtonElement>('.catalog-heading .btn-ghost')!.click();
    fixture.detectChanges();

    expect(verificarIntegridad).toHaveBeenCalledOnce();
    expect(el.textContent).toContain('Se verificaron 12 registros');
  });

  it('alerta la inconsistencia con el id y el detalle', () => {
    const { fixture, el } = crear();
    integridadRespuesta = { totalRegistros: 12, integra: false, primerInconsistenteId: 7, detalle: 'Hash no coincide en el registro #7.' };
    el.querySelector<HTMLButtonElement>('.catalog-heading .btn-ghost')!.click();
    fixture.detectChanges();

    expect(el.textContent).toContain('Cadena comprometida');
    expect(el.textContent).toContain('#7');
  });
});
