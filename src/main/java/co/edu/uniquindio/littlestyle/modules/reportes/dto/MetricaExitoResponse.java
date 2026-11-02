package co.edu.uniquindio.littlestyle.modules.reportes.dto;

import java.time.Instant;

/**
 * Foto de la tasa de éxito de exportaciones del servidor (RNF-24: estrictamente más del 98 %).
 *
 * <p>{@code tasaExito} es una fracción entre 0 y 1. {@code cumpleRnf24} usa {@code > 0.98}, no
 * {@code >=}: un 98,00 % exacto todavía no cumple. {@code desde} es el instante en que arrancó el
 * proceso; los contadores de Micrometer se reinician con cada despliegue.</p>
 */
public record MetricaExitoResponse(long ok, long error, long rechazado, double tasaExito,
                                   boolean cumpleRnf24, Instant desde) {
}
