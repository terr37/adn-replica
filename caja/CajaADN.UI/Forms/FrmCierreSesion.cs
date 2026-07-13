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
        Size = new Size(420, 320);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Resumen de Turno"));

        var lbl = new Label
        {
            Dock = DockStyle.Fill,
            Font = new Font("Consolas", 10),
            Padding = new Padding(20, 80, 20, 0),
            Text = "Cargando...",
        };
        Controls.Add(lbl);

        var btnCerrar = UiTheme.BotonPrimario("Cerrar Turno");
        btnCerrar.Dock = DockStyle.Bottom;
        btnCerrar.Margin = new Padding(20);
        btnCerrar.Click += (_, _) =>
        {
            sesionService.CerrarSesion();
            DialogResult = DialogResult.OK;
            Close();
        };
        Controls.Add(btnCerrar);

        Load += async (_, _) =>
        {
            var idSesion = sesionService.SesionActual!.IdSesion;

            await using var db = await dbFactory.CreateDbContextAsync();
            var transacciones = await db.Transacciones
                .Where(t => t.IdSesion == idSesion)
                .ToListAsync();

            var pagadas = transacciones.Where(t => t.Estado == EstadoPago.Pagado).ToList();
            var totalCobrado = pagadas.Sum(t => t.Monto);
            var pendientesSync = transacciones.Count(t => !t.Sincronizado);
            var anuladas = transacciones.Count(t => t.Estado == EstadoPago.Anulado);

            lbl.Text = $"Transacciones cobradas: {pagadas.Count}\n" +
                       $"Transacciones anuladas: {anuladas}\n" +
                       $"Total cobrado:          RD$ {totalCobrado:N2}\n" +
                       $"Pendientes de sync:     {pendientesSync}\n\n" +
                       (pendientesSync > 0
                           ? "⚠ Hay transacciones sin sincronizar.\n  Se completarán solas al recuperar conexión."
                           : "✔ Todo sincronizado con Integración.");
        };
    }
}