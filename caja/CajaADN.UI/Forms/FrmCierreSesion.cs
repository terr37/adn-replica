using CajaADN.Application.Services;
using CajaADN.Domain.Enums;

namespace CajaADN.UI.Forms;

public class FrmCierreSesion : Form
{
    public FrmCierreSesion(SesionService sesionService)
    {
        Text = "Cierre de Turno";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        Size = new Size(420, 320);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Resumen de Turno"));

        var sesion = sesionService.SesionActual!;
        var pagadas = sesion.Transacciones.Where(t => t.Estado == EstadoPago.Pagado).ToList();
        var totalCobrado = pagadas.Sum(t => t.Monto);
        var pendientesSync = sesion.Transacciones.Count(t => !t.Sincronizado);
        var anuladas = sesion.Transacciones.Count(t => t.Estado == EstadoPago.Anulado);

        var lbl = new Label
        {
            Dock = DockStyle.Fill,
            Font = new Font("Consolas", 10),
            Padding = new Padding(20, 80, 20, 0),
            Text = $"Transacciones cobradas: {pagadas.Count}\n" +
                   $"Transacciones anuladas: {anuladas}\n" +
                   $"Total cobrado:          RD$ {totalCobrado:N2}\n" +
                   $"Pendientes de sync:     {pendientesSync}\n\n" +
                   (pendientesSync > 0
                       ? "⚠ Hay transacciones sin sincronizar.\n  Se completarán solas al recuperar conexión."
                       : "✔ Todo sincronizado con Integración."),
        };

        var btnCerrar = UiTheme.BotonPrimario("Cerrar Turno");
        btnCerrar.Dock = DockStyle.Bottom;
        btnCerrar.Margin = new Padding(20);
        btnCerrar.Click += (_, _) =>
        {
            sesionService.CerrarSesion();
            DialogResult = DialogResult.OK;
            Close();
        };

        Controls.Add(lbl);
        Controls.Add(btnCerrar);
    }
}