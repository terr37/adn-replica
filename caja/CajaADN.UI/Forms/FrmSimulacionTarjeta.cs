using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CajaADN.UI.Forms;

public class FrmSimulacionTarjeta : Form
{
    public bool Aprobado { get; private set; }
    private readonly TextBox _txtUltimos4 = new() { MaxLength = 4, Width = 100, Font = new Font("Segoe UI", 11) };
    private readonly Label _lblEstado = new() { Dock = DockStyle.Fill, TextAlign = ContentAlignment.MiddleCenter, Font = new Font("Segoe UI", 11, FontStyle.Bold), ForeColor = Color.FromArgb(5, 20, 41) };
    private readonly Button _btnProcesar;

    public FrmSimulacionTarjeta(decimal monto)
    {
        Text = "Simulador POS";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        Size = new Size(400, 320); // Un poco más de altura para distribuir bien los paneles
        BackColor = UiTheme.FondoClaro;

        // Añadimos el encabezado institucional
        Controls.Add(UiTheme.CrearHeader("Simulación de pago con tarjeta"));

        // Panel del medio que contendrá el estado del proceso o mensajes de éxito
        var panelCentral = new Panel { Dock = DockStyle.Fill, Padding = new Padding(20, 160, 20, 60) };
        panelCentral.Controls.Add(_lblEstado);
        Controls.Add(panelCentral);

        // Rejilla de datos (Monto y Dígitos) reposicionada correctamente abajo del Header
        var tlp = new TableLayoutPanel { Dock = DockStyle.Top, ColumnCount = 2, RowCount = 2, Padding = new Padding(30, 85, 30, 0), Height = 150 };
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 45F));
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 55F));

        tlp.Controls.Add(new Label { Text = "Monto a cobrar:", AutoSize = true, Font = new Font("Segoe UI", 10), Anchor = AnchorStyles.Left }, 0, 0);
        tlp.Controls.Add(new Label { Text = $"RD$ {monto:N2}", AutoSize = true, Font = new Font("Segoe UI", 11, FontStyle.Bold), ForeColor = Color.Firebrick, Anchor = AnchorStyles.Left }, 1, 0);

        tlp.Controls.Add(new Label { Text = "Últimos 4 dígitos:", AutoSize = true, Font = new Font("Segoe UI", 10), Anchor = AnchorStyles.Left }, 0, 1);
        tlp.Controls.Add(_txtUltimos4, 1, 1);
        Controls.Add(tlp);

        // Botón procesar estilizado con el UiTheme acoplado abajo
        _btnProcesar = UiTheme.BotonPrimario("Procesar Pago Electrónico");
        _btnProcesar.Dock = DockStyle.Bottom;
        _btnProcesar.Click += async (_, _) => await ProcesarAsync();
        Controls.Add(_btnProcesar);
    }

    private async Task ProcesarAsync()
    {
        if (_txtUltimos4.Text.Trim().Length != 4 || !int.TryParse(_txtUltimos4.Text, out _))
        {
            MessageBox.Show("Ingrese los 4 dígitos numéricos de la tarjeta.", "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        _btnProcesar.Enabled = false;
        _txtUltimos4.Enabled = false;
        _lblEstado.Text = "⏳ Conectando con el terminal POS...";
        await Task.Delay(1200);

        _lblEstado.Text = "⚡ Autorizando transacciones...";
        await Task.Delay(1200);

        _lblEstado.ForeColor = Color.FromArgb(34, 139, 34); // Color Éxito
        _lblEstado.Text = $"✔ PAGO APROBADO\nTarjeta: **** **** **** {_txtUltimos4.Text.Trim()}";
        Aprobado = true;
        await Task.Delay(1500);

        DialogResult = DialogResult.OK;
        Close();
    }
}