# Casos de prueba — US-14

Los identificadores CP-US14 enlazan la regla de negocio con pruebas automáticas
existentes. Los casos con llamadas HTTP están cubiertos también por `US14AdminIntegrationTest`.

| ID | Regla | Escenario y resultado esperado | Evidencia automatizada |
|---|---|---|---|
| CP-US14-01 | Seguridad de administración | Sin token → 401; cliente/vendedor → 403; admin accede al panel. | `US14AdminIntegrationTest.apiAdminExigeAutenticacionRolYValidacionDelMotivo` |
| CP-US14-02 | Motivo obligatorio | Motivo vacío/corto se rechaza con 400; queda rastro de intento fallido. | `AdminUsuarioServiceTest.motivoVacioSeRechazaYQuedaTrazadoComoIntentoFallido`; integración MockMvc |
| CP-US14-03 | Protección de cuentas | No permite autosuspensión, operar sobre ADMINISTRADOR ni cambiar `ELIMINADO`. | `AdminUsuarioServiceTest.noPermiteAutosuspensionAdminSobreAdminNiCuentaEliminada` |
| CP-US14-04 | Suspensión y auditoría | Cambio concurrentemente protegido por `findByIdForUpdate`; actualiza estado, registra antes de publicar notificación y evento. | `AdminUsuarioServiceTest.suspendeCuentaYRegistraAuditoriaAntesDePublicarEvento` |
| CP-US14-05 | Invalidación y visibilidad del vendedor | Suspender vendedor invalida token y quita sus prendas de catálogo/recomendaciones; no altera pedidos pagados. | `US14AdminIntegrationTest.suspensionYDesactivacionSeReflejanEnCatalogoRecomendacionesYAuditoria` |
| CP-US14-06 | Alta y cola posterior | Prenda `ACTIVA`/`SIN_REVISAR` queda visible; cola filtra y ordena sin requerir aprobación previa. | `US14AdminIntegrationTest.suspensionYDesactivacionSeReflejanEnCatalogoRecomendacionesYAuditoria` |
| CP-US14-07 | Aprobar/desactivar/restaurar | Transiciones válidas actualizan estado; desactivación persiste motivo, fecha y admin y escribe auditoría. | `ModeracionProductoServiceTest.desactivacionGuardaMotivoFechaAdminYAudita`; `moderacion.spec.ts` |
| CP-US14-08 | Razón de desactivación | Sin motivo/motivo menor de 10 caracteres no envía; valido sí ejecuta `desactivar`. | `moderacion.spec.ts` |
| CP-US14-09 | Restricción del vendedor | Una prenda `DESACTIVADA` muestra motivo, no puede editarse/reactivarse por vendedor, y permite iniciar apelación. | `PrendaServiceModeracionTest`; `productos-lista.spec.ts` |
| CP-US14-10 | Visibilidad cliente | Prenda moderada deja de aparecer en catálogo/recomendaciones; no disponible en carrito y checkout responde error. | `US14AdminIntegrationTest.suspensionYDesactivacionSeReflejanEnCatalogoRecomendacionesYAuditoria` |
| CP-US14-11 | Prioridad de reporte | Reporte asociado a prenda aumenta la prioridad de su elemento en cola. | `IncidenciaServiceTest.reporteClienteVinculaLaPrendaParaPriorizarLaModeracion`; integración H2 |
| CP-US14-12 | Propiedad del producto | Vendedor no puede fingir reporte de cliente; solo dueño puede apelar su prenda desactivada. | `IncidenciaServiceTest.vendedorNoPuedeCrearReporteDeProductoEnNombreDeCliente`; `apelacionDeProductoSoloSeCreaParaPrendaDesactivadaDelVendedor` |
| CP-US14-13 | Flujo de incidencia | Usuario crea y consulta propias; admin toma, resuelve/rechaza con respuesta; el flujo queda auditado. | `IncidenciaServiceTest`; `incidencias-admin.spec.ts`; `mis-incidencias.spec.ts` |
| CP-US14-14 | Reporte desde detalle cliente | Dialogo valida asunto y descripción, envía `REPORTE_PRODUCTO` con `referenciaId`; error se informa. | `detalle.spec.ts` |
| CP-US14-15 | Inmutabilidad de hash | Hash determinista SHA-256; campos con delimitadores no colisionan; modificación se detecta. | `AuditoriaServiceTest.calculaHashSha256Determinista`, `camposConSeparadoresNoProducenColisiones`, `verificaCadenaValida`, `detectaManipulacionDeUnRegistro` |
| CP-US14-16 | Visor solo lectura | Admin filtra/pagina registros y puede verificar cadena; resultado consistente con backend (`integra`). | `auditoria.spec.ts`, `auditoria.service.spec.ts` |
| CP-US14-17 | Resumen RNF-17 | Dashboard presenta estado de usuarios, prendas sin revisar, incidencias y tasa de resolución. | `dashboard-admin.spec.ts`; `resumen-admin.service.spec.ts`; suite de integración H2 |
| CP-US14-18 | Errores y accesibilidad frontend | Componentes muestran vacío/carga/error, etiquetas y diálogos de motivo/respuesta accesibles. | Pruebas Vitest de páginas admin y detalle; `245` pruebas suite frontend |

## Evidencia agregada

- Backend: `.\mvnw.cmd test` — 400 pruebas, 0 fallos/errores.
- Integración: `.\mvnw.cmd -Dtest=US14AdminIntegrationTest test` — 2 pruebas, 0 fallos/errores.
- Frontend: `cd frontend; npm test -- --watch=false` — 245 pruebas, 0 fallos.
- Compilación: `cd frontend; npm run build` — correcta.
- Triggers MySQL: requiere ejecución manual en ambiente de despliegue; H2 no ejecuta SQL de trigger MySQL.

Las pruebas verifican el comportamiento y la instrumentación, pero no prueban el objetivo
estadístico (>99,5 % de trazabilidad o >90 % en menos de 24 horas) sobre tráfico real.
