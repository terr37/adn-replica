using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using CajaADN.Application.Services;
using CajaADN.Domain.Enums;
using CajaADN.Domain.Models;
using CajaADN.Integration.Data;
using CajaADN.UI.Services;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.UI.Forms;

public class FrmCierreSesion : Form
{
    public FrmCierreSesion(SesionService sesionService, IDbContextFactory<CajaDbContext> dbFactory)
    {
        Text = "Cierre de Turno";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        Size = new Size(450, 400);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Resumen de Turno"));

        var lbl = new Label
        {
            Dock = DockStyle.Fill,
            Font = new Font("Consolas", 10),
            Padding = new Padding(20, 80, 20, 0),
            Text = "Calculando cuadre de caja...",
        };
        Controls.Add(lbl);

        var btnCerrar = UiTheme.BotonPrimario("Confirmar Cierre de Turno");
        btnCerrar.Dock = DockStyle.Bottom;
        btnCerrar.Margin = new Padding(20);
        btnCerrar.Click += (_, _) =>
        {
            sesionService.CerrarSesion();
            DialogResult = DialogResult.OK;
            Close();
        };
        Controls.Add(btnCerrar);

        // Evento Load que calcula totales, genera el reporte físico y solicita guardar en PDF
        Load += async (_, _) =>
        {
            var sesion = sesionService.SesionActual!;

            await using var db = await dbFactory.CreateDbContextAsync();
            var transacciones = await db.Transacciones
                .Where(t => t.IdSesion == sesion.IdSesion)
                .ToListAsync();

            var pagadas = transacciones.Where(t => t.Estado == EstadoPago.Pagado).ToList();
            var totalCobrado = pagadas.Sum(t => t.Monto);
            var totalEfectivo = pagadas.Where(t => t.MetodoPago == MetodoPago.Efectivo).Sum(t => t.Monto);
            var totalTarjeta = pagadas.Where(t => t.MetodoPago == MetodoPago.Tarjeta).Sum(t => t.Monto);
            
            var anuladas = transacciones.Count(t => t.Estado == EstadoPago.Anulado);
            var pendientesSync = transacciones.Count(t => !t.Sincronizado);
            
            // Cuando se hace un pago en efectivo, se reste de la apertura de la caja
            var efectivoEsperado = sesion.EfectivoInicial - totalEfectivo;

            // 1. Mostrar el resumen extendido en la pantalla para el cajero
            lbl.Text = $"Cajero:                 {sesion.UsuarioCajero}\n" +
                       $"Efectivo inicial:       RD$ {sesion.EfectivoInicial:N2}\n" +
                       $"Transacciones cobradas: {pagadas.Count}\n" +
                       $"Transacciones anuladas: {anuladas}\n" +
                       $"Cobros en Efectivo:     RD$ {totalEfectivo:N2}\n" +
                       $"Cobros en Tarjeta:      RD$ {totalTarjeta:N2}\n" +
                       $"Total cobrado general:  RD$ {totalCobrado:N2}\n" +
                       $"Efectivo esperado:      RD$ {efectivoEsperado:N2}\n" +
                       $"Pendientes de sync:     {pendientesSync}\n\n" +
                       (pendientesSync > 0
                           ? "⚠ Hay transacciones sin sincronizar."
                           : "✔ Todo sincronizado con Integración.");

            // 2. Generar físicamente el archivo del reporte de cuadre (.txt)
            try
            {
                var carpeta = Path.Combine(AppContext.BaseDirectory, "Reportes");
                Directory.CreateDirectory(carpeta);

                var ruta = Path.Combine(carpeta, $"Cuadre_{sesion.UsuarioCajero}_{DateTime.Now:yyyyMMdd_HHmm}.txt");

                var contenidoReporte =
                    "═══════════════════════════════\n" +
                    "     CUADRE DE CAJA — TURNO\n" +
                    "═══════════════════════════════\n" +
                    $"Cajero:            {sesion.UsuarioCajero}\n" +
                    $"Apertura:          {sesion.FechaApertura:dd/MM/yyyy HH:mm}\n" +
                    $"Cierre:            {DateTime.Now:dd/MM/yyyy HH:mm}\n" +
                    $"Efectivo inicial:  RD$ {sesion.EfectivoInicial:N2}\n" +
                    $"Cobros Efectivo:   RD$ {totalEfectivo:N2}\n" +
                    $"Cobros Tarjeta:    RD$ {totalTarjeta:N2}\n" +
                    $"Total Cobrado:     RD$ {totalCobrado:N2}\n" +
                    $"Transacciones:     {pagadas.Count} pagadas / {anuladas} anuladas\n" +
                    $"Efectivo esperado: RD$ {efectivoEsperado:N2}\n" +
                    "═══════════════════════════════\n";

                await File.WriteAllTextAsync(ruta, contenidoReporte);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"No se pudo guardar el reporte en disco: {ex.Message}", "Error de Reporte", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            // 3. Ofrecer guardar el reporte de cuadre en PDF
            using (var sfd = new SaveFileDialog
            {
                Filter = "Archivos PDF (*.pdf)|*.pdf",
                FileName = $"Cuadre_{sesion.UsuarioCajero}_{DateTime.Now:yyyyMMdd_HHmm}.pdf",
                Title = "Guardar Cuadre de Caja en PDF"
            })
            {
                if (sfd.ShowDialog(this) == DialogResult.OK)
                {
                    try
                    {
                        PdfReportService.GenerarCuadrePdf(
                            sesion,
                            totalEfectivo,
                            totalTarjeta,
                            totalCobrado,
                            pagadas.Count,
                            anuladas,
                            efectivoEsperado,
                            sfd.FileName
                        );

                        var result = MessageBox.Show(
                            "Reporte de cuadre guardado en PDF con éxito.\n¿Desea abrirlo?",
                            "Abrir Cuadre",
                            MessageBoxButtons.YesNo,
                            MessageBoxIcon.Question
                        );

                        if (result == DialogResult.Yes)
                        {
                            var ps = new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = sfd.FileName,
                                UseShellExecute = true
                            };
                            System.Diagnostics.Process.Start(ps);
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show($"Error al generar el PDF del cuadre: {ex.Message}", "Error PDF", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        };
    }
}