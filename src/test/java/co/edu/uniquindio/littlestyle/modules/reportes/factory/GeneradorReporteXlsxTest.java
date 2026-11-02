package co.edu.uniquindio.littlestyle.modules.reportes.factory;

import co.edu.uniquindio.littlestyle.modules.reportes.dto.ColumnaReporte;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.ReporteDatos;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.TablaReporte;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.TipoColumna;
import co.edu.uniquindio.littlestyle.modules.reportes.dto.TipoReporte;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GeneradorReporteXlsxTest {

    private final GeneradorReporteXlsx generador = new GeneradorReporteXlsx();

    @Test
    void elArchivoEsUnXlsxRealConHojasDatosYResumen() throws Exception {
        byte[] bytes = generador.generar(datos());

        assertThat(new String(bytes, 0, 2, StandardCharsets.ISO_8859_1)).isEqualTo("PK");
        try (Workbook libro = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            assertThat(libro.getSheet("Datos")).isNotNull();
            assertThat(libro.getSheet("Resumen")).isNotNull();
        }
    }

    @Test
    void losEncabezadosSalenDeLaTablaTipada() throws Exception {
        try (Workbook libro = abrir()) {
            Row cabecera = libro.getSheet("Datos").getRow(0);
            assertThat(cabecera.getCell(0).getStringCellValue()).isEqualTo("Sección");
            assertThat(cabecera.getCell(1).getStringCellValue()).isEqualTo("Concepto");
            assertThat(cabecera.getCell(2).getStringCellValue()).isEqualTo("Cantidad");
            assertThat(cabecera.getCell(3).getStringCellValue()).isEqualTo("Valor");
            assertThat(cabecera.getCell(4).getStringCellValue()).isEqualTo("Fecha");
        }
    }

    @Test
    void numerosYFechasConservanSuTipoParaPoderSumarlos() throws Exception {
        try (Workbook libro = abrir()) {
            Row fila = libro.getSheet("Datos").getRow(1);
            assertThat(fila.getCell(2).getCellType()).isEqualTo(CellType.NUMERIC);
            assertThat(fila.getCell(2).getNumericCellValue()).isEqualTo(12d);
            assertThat(fila.getCell(3).getCellType()).isEqualTo(CellType.NUMERIC);
            assertThat(fila.getCell(3).getNumericCellValue()).isEqualTo(1500000.5d);
            assertThat(fila.getCell(3).getCellStyle().getDataFormatString()).contains("COP");
            assertThat(fila.getCell(4).getCellType()).isEqualTo(CellType.NUMERIC);
            assertThat(org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(fila.getCell(4))).isTrue();
        }
    }

    @Test
    void laHojaDatosTienePanelCongeladoYAutofiltro() throws Exception {
        try (Workbook libro = abrir()) {
            XSSFSheet hoja = ((XSSFWorkbook) libro).getSheet("Datos");
            assertThat(hoja.getPaneInformation()).isNotNull();
            assertThat(hoja.getPaneInformation().isFreezePane()).isTrue();
            assertThat(hoja.getCTWorksheet().isSetAutoFilter()).isTrue();
            assertThat(hoja.getCTWorksheet().getAutoFilter().getRef()).isEqualTo("A1:E3");
        }
    }

    @Test
    void unTextoQuePareceFormulaSeNeutraliza() throws Exception {
        try (Workbook libro = abrir()) {
            Cell celda = libro.getSheet("Datos").getRow(2).getCell(1);
            assertThat(celda.getStringCellValue()).isEqualTo("'=SUMA(A1:A2)");
            assertThat(celda.getCellType()).isEqualTo(CellType.STRING);
        }
    }

    @Test
    void laHojaResumenReplicaTituloYParametros() throws Exception {
        try (Workbook libro = abrir()) {
            Sheet resumen = libro.getSheet("Resumen");
            assertThat(resumen.getRow(0).getCell(0).getStringCellValue()).contains("Reporte de ventas");
            String todo = textoDe(resumen);
            assertThat(todo).contains("Alcance").contains("Consolidado global")
                    .contains("Total").contains("Total ventas").contains("COP $ 1.500.000");
        }
    }

    private Workbook abrir() throws Exception {
        return new XSSFWorkbook(new ByteArrayInputStream(generador.generar(datos())));
    }

    private static String textoDe(Sheet hoja) {
        StringBuilder texto = new StringBuilder();
        for (Row fila : hoja) {
            for (Cell celda : fila) {
                texto.append(celda.toString()).append('\n');
            }
        }
        return texto.toString();
    }

    private static ReporteDatos datos() {
        TablaReporte tabla = new TablaReporte(
                List.of(new ColumnaReporte("Sección", TipoColumna.TEXTO),
                        new ColumnaReporte("Concepto", TipoColumna.TEXTO),
                        new ColumnaReporte("Cantidad", TipoColumna.ENTERO),
                        new ColumnaReporte("Valor", TipoColumna.MONEDA),
                        new ColumnaReporte("Fecha", TipoColumna.FECHA)),
                List.of(List.of("Indicadores clave", "Ventas totales", 12L, new BigDecimal("1500000.5"),
                                LocalDate.of(2026, 10, 1)),
                        List.of("Indicadores clave", "=SUMA(A1:A2)", 1L, BigDecimal.ONE,
                                LocalDate.of(2026, 10, 2))));
        Map<String, Object> parametros = Map.of(
                "TITULO", "Reporte de ventas",
                "SUBTITULO", "Del 01/10/2026 al 28/10/2026",
                "ALCANCE", "Consolidado global",
                "GENERADO_POR", "Admin",
                "GENERADO_EN", "28/10/2026 10:00",
                "TOTAL_VENTAS", "COP $ 1.500.000");
        return new ReporteDatos(TipoReporte.VENTAS, "Reporte de ventas", "reporte-ventas", parametros,
                List.of(), tabla);
    }
}
