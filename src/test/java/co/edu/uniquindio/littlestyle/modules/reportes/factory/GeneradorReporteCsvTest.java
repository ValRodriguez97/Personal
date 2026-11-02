package co.edu.uniquindio.littlestyle.modules.reportes.factory;

import co.edu.uniquindio.littlestyle.modules.reportes.dto.ColumnaReporte;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.ReporteDatos;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.TablaReporte;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.TipoColumna;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.TipoReporte;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GeneradorReporteCsvTest {

    private final GeneradorReporteCsv generador = new GeneradorReporteCsv();

    @Test
    void empiezaConBomParaQueExcelRespeteLasTildes() {
        byte[] bytes = generador.generar(datos());
        assertThat(new byte[]{bytes[0], bytes[1], bytes[2]})
                .containsExactly((byte) 0xEF, (byte) 0xBB, (byte) 0xBF);
    }

    @Test
    void usaPuntoYComaYCrlfEnLaConfiguracionRegionalDeColombia() {
        String csv = texto();
        assertThat(csv).startsWith("Sección;Concepto;Cantidad;Valor;Fecha\r\n");
        assertThat(csv.split("\r\n")).hasSize(3);
    }

    @Test
    void losValoresViajanCrudosSinSimboloDeMoneda() {
        String csv = texto();
        assertThat(csv).contains(";12;1500000.5;2026-10-01");
        assertThat(csv).doesNotContain("COP $");
        assertThat(csv).doesNotContain("1.500.000");
    }

    @Test
    void aplicaEscapeRfc4180CuandoElTextoTraeElSeparador() {
        String csv = texto();
        assertThat(csv).contains("\"Vestido; rojo\"");
        assertThat(csv).contains("\"Camisa \"\"estampada\"\"\"");
    }

    @Test
    void neutralizaTextosQueParecenFormulas() {
        assertThat(texto()).contains(";'=SUMA(A1:A2);");
    }

    private String texto() {
        return new String(generador.generar(datos()), StandardCharsets.UTF_8).substring(1);
    }

    private static ReporteDatos datos() {
        TablaReporte tabla = new TablaReporte(
                List.of(new ColumnaReporte("Sección", TipoColumna.TEXTO),
                        new ColumnaReporte("Concepto", TipoColumna.TEXTO),
                        new ColumnaReporte("Cantidad", TipoColumna.ENTERO),
                        new ColumnaReporte("Valor", TipoColumna.MONEDA),
                        new ColumnaReporte("Fecha", TipoColumna.FECHA)),
                List.of(List.of("Vestido; rojo", "Camisa \"estampada\"", 12L, new BigDecimal("1500000.5"),
                                LocalDate.of(2026, 10, 1)),
                        List.of("Indicadores clave", "=SUMA(A1:A2)", 1L, BigDecimal.ONE,
                                LocalDate.of(2026, 10, 2))));
        return new ReporteDatos(TipoReporte.VENTAS, "Reporte de ventas", "reporte-ventas",
                Map.of("TITULO", "Reporte de ventas"), List.of(), tabla);
    }
}
