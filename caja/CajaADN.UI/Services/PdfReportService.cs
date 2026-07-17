using System;
using System.IO;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using CajaADN.Domain.Models;

namespace CajaADN.UI.Services;

public static class PdfReportService
{
    public static void GenerarReciboPdf(Transaccion t, string cajero, string filePath)
    {
        Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A6);
                page.Margin(0.6f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(9).FontFamily("Arial").FontColor(Colors.Grey.Darken3));

                page.Header()
                    .AlignCenter()
                    .Column(col =>
                    {
                        col.Item().Text("ALCALDÍA DEL DISTRITO NACIONAL").Bold().FontSize(11).AlignCenter().FontColor(Colors.Blue.Darken4);
                        col.Item().Text("DIRECCIÓN DE REGISTRO Y RECAUDACIÓN").SemiBold().FontSize(7).AlignCenter().FontColor(Colors.Grey.Darken1);
                        col.Item().PaddingTop(4).LineHorizontal(1).LineColor(Colors.Blue.Darken4);
                    });

                page.Content()
                    .PaddingVertical(0.4f, Unit.Centimetre)
                    .Column(col =>
                    {
                        col.Spacing(5);

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("NCF").Bold();
                            row.RelativeItem().AlignRight().Text(t.NcfSimulado).Bold().FontColor(Colors.Blue.Darken3);
                        });

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("Fecha/Hora");
                            row.RelativeItem().AlignRight().Text(t.TimestampLocal.ToString("dd/MM/yyyy HH:mm"));
                        });

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("Cajero");
                            row.RelativeItem().AlignRight().Text(cajero);
                        });

                        col.Item().PaddingVertical(2).LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);

                        col.Item().Text("DATOS DEL CONTRIBUYENTE").Bold().FontSize(8).FontColor(Colors.Blue.Darken4);

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("Nombre");
                            row.RelativeItem().AlignRight().Text(t.NombreContribuyente);
                        });

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("Cédula/RNC");
                            row.RelativeItem().AlignRight().Text(t.Cedula);
                        });

                        col.Item().PaddingVertical(2).LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);

                        col.Item().Text("DETALLE DEL SERVICIO").Bold().FontSize(8).FontColor(Colors.Blue.Darken4);

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("Concepto");
                            row.RelativeItem().AlignRight().Text(t.Tipo.ToString().Replace("PAGO_", "").Replace("_", " "));
                        });

                        if (!string.IsNullOrWhiteSpace(t.Descripcion))
                        {
                            col.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Descripción");
                                row.RelativeItem().AlignRight().Text(t.Descripcion);
                            });
                        }

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("Método de Pago");
                            row.RelativeItem().AlignRight().Text(t.MetodoPago.ToString());
                        });

                        col.Item().PaddingVertical(4).LineHorizontal(1).LineColor(Colors.Grey.Lighten1);

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text("TOTAL PAGADO").Bold().FontSize(10).FontColor(Colors.Blue.Darken4);
                            row.RelativeItem().AlignRight().Text($"RD$ {t.Monto:N2}").Bold().FontSize(11).FontColor(Colors.Blue.Darken4);
                        });
                    });

                page.Footer()
                    .AlignCenter()
                    .Column(col =>
                    {
                        col.Item().LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);
                        col.Item().PaddingTop(3).Text("Comprobante de Pago Oficial").AlignCenter().FontSize(7).Italic();
                        col.Item().Text("Conserve este recibo para sus archivos.").AlignCenter().FontSize(6).FontColor(Colors.Grey.Darken1);
                    });
            });
        }).GeneratePdf(filePath);
    }

    public static void GenerarCuadrePdf(SesionCaja sesion, decimal totalEfectivo, decimal totalTarjeta, decimal totalCobrado, int pagadas, int anuladas, decimal efectivoEsperado, string filePath)
    {
        Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial").FontColor(Colors.Grey.Darken3));

                page.Header()
                    .Column(col =>
                    {
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text("ALCALDÍA DEL DISTRITO NACIONAL").Bold().FontSize(16).FontColor(Colors.Blue.Darken4);
                                c.Item().Text("DEPARTAMENTO DE TESORERÍA Y CAJA").SemiBold().FontSize(10).FontColor(Colors.Grey.Darken1);
                                c.Item().Text("REPORTE DE CUADRE DIARIO / CIERRE DE TURNO").Bold().FontSize(12).FontColor(Colors.Blue.Darken3);
                            });
                        });
                        col.Item().PaddingVertical(8).LineHorizontal(2).LineColor(Colors.Blue.Darken4);
                    });

                page.Content()
                    .PaddingVertical(0.5f, Unit.Centimetre)
                    .Column(col =>
                    {
                        col.Spacing(12);

                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().Text($"Cajero a cargo: {sesion.UsuarioCajero}").Bold();
                                c.Item().Text($"Fecha de Apertura: {sesion.FechaApertura:dd/MM/yyyy HH:mm}");
                                c.Item().Text($"Fecha de Cierre: {DateTime.Now:dd/MM/yyyy HH:mm}");
                            });
                            row.RelativeItem().AlignRight().Column(c =>
                            {
                                c.Item().Text("ID de Sesión:").FontSize(8).FontColor(Colors.Grey.Darken1);
                                c.Item().Text($"{sesion.IdSesion}").FontSize(8).FontFamily("Courier New").FontColor(Colors.Grey.Darken2);
                                c.Item().Text("Estado Turno: CERRADO").Bold().FontColor(Colors.Red.Darken2);
                            });
                        });

                        col.Item().PaddingVertical(4).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);

                        col.Item().Text("RESUMEN CONTABLE DE FONDOS Y TRANSACCIONES").Bold().FontSize(11).FontColor(Colors.Blue.Darken4);

                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(2);
                            });

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).Text("Fondo Inicial (Apertura de Caja)").SemiBold();
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"RD$ {sesion.EfectivoInicial:N2}");

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).Text("Cobros Registrados en Efectivo");
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"RD$ {totalEfectivo:N2}");

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).Text("Cobros Registrados en Tarjeta");
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"RD$ {totalTarjeta:N2}");

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).Text("Total General Cobrado (Efectivo + Tarjeta)").SemiBold();
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"RD$ {totalCobrado:N2}");

                            table.Cell().Background(Colors.Grey.Lighten4).BorderBottom(1).BorderColor(Colors.Grey.Darken2).Padding(8).Text("Efectivo Esperado en Caja (Fondo Inicial - Efectivo Cobrado)").Bold();
                            table.Cell().Background(Colors.Grey.Lighten4).BorderBottom(1).BorderColor(Colors.Grey.Darken2).Padding(8).AlignRight().Text($"RD$ {efectivoEsperado:N2}").Bold().FontColor(Colors.Blue.Darken4);

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).Text("Cantidad de Transacciones Procesadas (Pagadas)");
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"{pagadas}");

                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).Text("Cantidad de Transacciones Anuladas");
                            table.Cell().BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"{anuladas}");
                        });

                        col.Item().PaddingTop(20).Text("Firmas Autorizadas").Bold().FontSize(10).FontColor(Colors.Blue.Darken4);

                        col.Item().PaddingTop(30).Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().LineHorizontal(1).LineColor(Colors.Grey.Darken1);
                                c.Item().PaddingTop(4).Text("Firma del Cajero").AlignCenter().FontSize(8);
                            });
                            row.ConstantItem(40);
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().LineHorizontal(1).LineColor(Colors.Grey.Darken1);
                                c.Item().PaddingTop(4).Text("Firma del Supervisor de Turno").AlignCenter().FontSize(8);
                            });
                        });
                    });

                page.Footer()
                    .Column(col =>
                    {
                        col.Item().PaddingVertical(8).LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten1);
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Text($"Reporte de Sistema ADN Caja — Impreso el {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(8).Italic();
                            row.RelativeItem().AlignRight().Text("Página 1 de 1").FontSize(8);
                        });
                    });
            });
        }).GeneratePdf(filePath);
    }
}
