using System.IO; // ← Obligatorio para guardar el archivo de reporte
using CajaADN.Application.Services;
using CajaADN.Domain.Enums;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.UI.Forms;

public class FrmCierreSesion : Form
{
    public FrmCierreSesion(SesionService sesionService, IDbContextFactory<CajaDbContext> dbFactory)
    {
        Text = "Cierre de Turno";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        Size = new Size(420, 360); // Aumentado ligeramente de 320 a 360 para que quepa todo el texto nuevo
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

        // Evento Load que calcula totales y genera el reporte físico
        Load += async (_, _) =>
        {
            var sesion = sesionService.SesionActual!;

            await using var db = await dbFactory.CreateDbContextAsync();
            var transacciones = await db.Transacciones
                .Where(t => t.IdSesion == sesion.IdSesion)
                .ToListAsync();

            var pagadas = transacciones.Where(t => t.Estado == EstadoPago.Pagado).ToList();
            var totalCobrado = pagadas.Sum(t => t.Monto);
            var anuladas = transacciones.Count(t => t.Estado == EstadoPago.Anulado);
            var pendientesSync = transacciones.Count(t => !t.Sincronizado);
            var efectivoEsperado = sesion.EfectivoInicial + totalCobrado;

            // 1. Mostrar el resumen extendido en la pantalla para el cajero
            lbl.Text = $"Cajero:                 {sesion.UsuarioCajero}\n" +
                       $"Efectivo inicial:       RD$ {sesion.EfectivoInicial:N2}\n" +
                       $"Transacciones cobradas: {pagadas.Count}\n" +
                       $"Transacciones anuladas: {anuladas}\n" +
                       $"Total cobrado:          RD$ {totalCobrado:N2}\n" +
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
                    $"Total cobrado:     RD$ {totalCobrado:N2}\n" +
                    $"Transacciones:     {pagadas.Count} pagadas / {anuladas} anuladas\n" +
                    $"Efectivo esperado: RD$ {efectivoEsperado:N2}\n" +
                    "═══════════════════════════════\n";

                await File.WriteAllTextAsync(ruta, contenidoReporte);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"No se pudo guardar el reporte en disco: {ex.Message}", "Error de Reporte", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        };
    }
}