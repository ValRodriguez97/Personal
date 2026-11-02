# Métricas del RNF-24 — exportaciones de reportes (US-16)

Este documento fija **qué se mide**, **cómo se calcula** y **cómo se audita** el requisito
«más del 98 % de las solicitudes de exportación deben finalizar correctamente». Es la referencia
para el equipo y para la evidencia de calidad. La medición vive en el proceso y se consulta por
Actuator; no requiere infraestructura de monitoreo externa.

## 1. Regla y umbral

Una exportación es exitosa solo si el archivo se generó, viajó completo y el usuario pudo abrirlo o
guardarlo. El umbral es **estrictamente mayor que 0,98**:

```text
cumpleRnf24 = tasa > 0.98
```

Un `49 OK + 1 error = 0,98` **no cumple**. Hace falta un éxito adicional para superar el 98 %.

## 2. Dos contadores, dos preguntas

| Contador (Actuator) | Etiquetas | Valores de `resultado` | Pregunta que responde |
|---|---|---|---|
| `reporte.exportaciones` | `tipo`, `formato`, `resultado` | `ok`, `rechazado`, `error` | ¿El servidor pudo generar y entregar el archivo? |
| `reporte.exportaciones.cliente` | `tipo`, `formato`, `resultado` | `ok`, `error_red`, `blob_vacio`, `error_cliente`, `cancelado` | ¿El navegador pudo abrir, guardar o imprimir lo que recibió? |
| `reporte.exportacion.duracion` | `tipo`, `formato` | — (temporizador) | ¿Cuánto tarda la generación en el servidor? |

En `/actuator/metrics` los nombres se consultan con puntos, tal como se registran en Micrometer:
`reporte.exportaciones`, `reporte.exportaciones.cliente` y `reporte.exportacion.duracion`.

### Semántica de cada resultado

| Valor | Quién lo emite | Significado | ¿Entra en la tasa? |
|---|---|---|---|
| `ok` (servidor) | Backend | Generó el archivo y respondió `200` | Sí, en el numerador |
| `error` | Backend | Excepción interna o `BusinessException` `5xx` | Sí, en el denominador |
| `rechazado` | Backend | Validación del solicitante (`4xx`: fechas, categoría, formato, demasiadas filas) | **No**: no es un fallo del sistema |
| `ok` (cliente) | Navegador | Guardó, abrió o imprimió el archivo | Sí, en el numerador |
| `error_red` | Navegador | La petición nunca llegó al servidor (`status 0`) | Sí, en el denominador |
| `blob_vacio` | Navegador | El servidor respondió `200` pero con un archivo de 0 bytes | Sí, en el denominador |
| `error_cliente` | Navegador | `4xx/5xx`, archivo corrupto, permisos de descarga o fallo del navegador | Sí, en el denominador |
| `cancelado` | Navegador | El usuario pulsó «Cancelar» | **No**: decisión del usuario |

## 3. Fórmulas

Tasa del servidor (la que publica `GET /api/v1/reportes/metricas/exito` y la que se compara con el
umbral del requisito):

```text
tasaServidor = ok / (ok + error)
```

Tasa de punta a punta (la que responde «¿el usuario obtuvo su archivo?»):

```text
tasaCliente = ok / (ok + error_red + blob_vacio + error_cliente)
```

Sin evidencia (`ok + error == 0`) se asume `tasaExito = 1.0` y `cumpleRnf24 = true` para no bloquear
la entrega antes de la primera solicitud. Los rechazos y las cancelaciones **nunca** se suman al
denominador del requisito.

## 4. Contrato del endpoint

`GET /api/v1/reportes/metricas/exito` — solo `ADMINISTRADOR`.

```json
{
  "ok": 120,
  "error": 1,
  "rechazado": 4,
  "tasaExito": 0.9917,
  "cumpleRnf24": true,
  "desde": "2026-10-31T10:00:00Z"
}
```

- `tasaExito` está redondeada a 4 decimales y vive entre `0` y `1`.
- `desde` es el instante en que arrancó el proceso que tiene los contadores.
- `cumpleRnf24` aplica `> 0.98` sobre `tasaExito` sin redondear.
- Los contadores son **en memoria**: se reinician con cada despliegue.

## 5. Consulta operativa con Actuator

Actuator expone `health`, `info` y `metrics`. Las métricas se consultan por nombre:

```bash
# Todas las series del contador del servidor.
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportaciones"

# Solo los éxitos.
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportaciones?tag=resultado:ok"

# Un tipo y formato concretos.
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportaciones?tag=tipo:ventas&tag=formato:pdf"

# Telemetría del navegador: errores de red.
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportaciones.cliente?tag=resultado:error_red"

# Duración de generación.
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportacion.duracion"
```

La respuesta tiene la forma:

```json
{
  "name": "reporte.exportaciones",
  "measurements": [{ "statistic": "COUNT", "value": 121.0 }],
  "availableTags": [
    { "tag": "tipo", "values": ["ventas", "demanda", "inventario", "busquedas"] },
    { "tag": "formato", "values": ["pdf", "xlsx", "csv"] },
    { "tag": "resultado", "values": ["ok", "rechazado", "error"] }
  ]
}
```

Actuator entrega una **foto** de los contadores; no calcula tasas ni conserva histórico. Para la
tasa del requisito se usa `/metricas/exito`, que aplica la fórmula y el umbral.

## 6. Operación y seguridad

- `application.properties` expone `health,info,metrics` en Actuator.
- `/actuator/health` es público; el resto de endpoints de Actuator exige `ADMINISTRADOR`.
- La telemetría del cliente está limitada a **30 eventos por usuario y minuto**; al excederse
  responde `429` y **no** incrementa el contador. El mapa de ventanas se poda al superar 10 000
  usuarios.
- Un fallo al enviar telemetría es «fire and forget»: nunca rompe la descarga ni muestra un error al
  usuario.
- El cliente envía `resultado` en minúsculas (`ok`, `error_red`, `blob_vacio`, `error_cliente`,
  `cancelado`), igual que las etiquetas de Micrometer.
- Al reiniciar el proceso, los contadores vuelven a cero y `desde` cambia.

## 7. Evidencia automatizada

| Qué se prueba | Test |
|---|---|
| Umbral estricto 0,98 y tasas | `ReporteMetricasTest` |
| Rechazos `4xx` excluidos y errores `5xx` contados | `ReporteServiceTest` |
| Contrato HTTP, extensión de archivo y telemetría | `ReporteControllerTest` |
| Seguridad real: 401, 403, roles y `400` de validación | `ReporteControllerSecurityTest` |
| Clasificación de telemetría y cancelación en Angular | `exportar-reporte.spec.ts`, `reportes.service.spec.ts` |
| Consulta JPQL del reporte de búsquedas | `ReporteBusquedaRepositoryTest` |

Comandos:

```bash
./mvnw test
cd frontend && npm test -- --watch=false
```

## 8. Verificación manual

```bash
# 1. Autenticarse como administrador y guardar el token.
TOKEN="<jwt-de-administrador>"

# 2. Consultar la foto del proceso.
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/reportes/metricas/exito | jq

# 3. Ver el contador del servidor y el del cliente.
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportaciones?tag=resultado:ok" | jq
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/actuator/metrics/reporte.exportaciones.cliente" | jq

# 4. Generar una exportación y volver a consultar.
curl -s -o /tmp/ventas.xlsx -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/reportes/ventas?formato=XLSX"
```

## 9. Decisiones registradas

1. **Contadores separados**: un solo contador con etiqueta `origen` obligaba a filtrar en cada
   consulta y permitía sumar por error eventos del cliente con respuestas del servidor. Separarlos
   hace que la consulta del RNF-24 sea la consulta por defecto.
2. **Minúsculas**: el contrato de telemetría y las etiquetas de Micrometer usan el mismo vocabulario.
   Mezclar `OK` y `ok` crearía series duplicadas y consultas inconsistentes.
3. **Umbral estricto**: «más del 98 %» no es «98 % o más». El caso 49/50 = 0,98 se prueba
   explícitamente para que nadie lo «arregle» a `>=`.
4. **`4xx` fuera de la tasa**: una fecha inválida o una categoría inexistente es un error de uso, no
   una caída del sistema. Contarla castigaría la calidad del producto por entradas del usuario.
5. **Cancelación fuera de la tasa**: cancelar es una acción deliberada; contarla como fallo
   distorsionaría la métrica.
6. **`desde` en la respuesta**: sin ese dato, un contador reiniciado parecía una caída de volumen.
   Con `desde` se distingue «no hubo solicitudes» de «el proceso acaba de arrancar».
7. **Sin registro externo**: para el alcance de la US-16, Actuator y `/metricas/exito` cubren la
   medición y la evidencia. No se agrega una dependencia de monitoreo que nadie va a consultar. Si
   más adelante se necesita histórico entre despliegues, se conecta un `MeterRegistry` persistente
   y se actualiza este documento.
