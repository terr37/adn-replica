namespace CajaADN.UI.Forms;

/// <summary>
/// Ventana simple para calcular el vuelto.
/// </summary>
public class FrmCalcularVuelto : Form
{
    private readonly decimal _montoACobrar;

    private readonly Label _lblMontoACobrar;

    private readonly NumericUpDown _numEfectivoRecibido = new()
    {
        Dock = DockStyle.Fill,
        DecimalPlaces = 2,
        Maximum = 1000000,
        ThousandsSeparator = true
    };

    private readonly Label _lblResultado = new()
    {
        Dock = DockStyle.Fill,
        Font = new Font("Segoe UI", 16, FontStyle.Bold),
        TextAlign = ContentAlignment.MiddleCenter,
        Text = "Ingrese el efectivo recibido."
    };

    public FrmCalcularVuelto(decimal montoACobrar)
    {
        _montoACobrar = montoACobrar;

        Text = "Calcular Vuelto";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        ClientSize = new Size(420, 340);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Calcular Vuelto"));

        _lblMontoACobrar = new Label
        {
            Text = $"Monto a cobrar: RD$ {_montoACobrar:N2}",
            Font = new Font("Segoe UI", 12, FontStyle.Bold),
            Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.MiddleLeft
        };

        var tlp = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            Padding = new Padding(20, 80, 20, 20),
            ColumnCount = 1,
            RowCount = 5
        };

        tlp.RowStyles.Add(new RowStyle(SizeType.Absolute, 40));
        tlp.RowStyles.Add(new RowStyle(SizeType.Absolute, 25));
        tlp.RowStyles.Add(new RowStyle(SizeType.Absolute, 40));
        tlp.RowStyles.Add(new RowStyle(SizeType.Absolute, 60));
        tlp.RowStyles.Add(new RowStyle(SizeType.Absolute, 50));

        tlp.Controls.Add(_lblMontoACobrar);

        tlp.Controls.Add(new Label
        {
            Text = "Efectivo recibido (RD$):",
            AutoSize = true,
            Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.BottomLeft
        });

        tlp.Controls.Add(_numEfectivoRecibido);

        tlp.Controls.Add(_lblResultado);

        var btnCalcular = UiTheme.BotonPrimario("Calcular Vuelto");
        btnCalcular.Dock = DockStyle.Fill;
        btnCalcular.Height = 40;
        btnCalcular.Click += (_, _) => Calcular();

        tlp.Controls.Add(btnCalcular);

        Controls.Add(tlp);

        AcceptButton = btnCalcular;
    }

    private void Calcular()
    {
        decimal recibido = _numEfectivoRecibido.Value;
        decimal vuelto = recibido - _montoACobrar;

        if (vuelto < 0)
        {
            _lblResultado.ForeColor = UiTheme.Peligro;
            _lblResultado.Text = $"Faltan RD$ {Math.Abs(vuelto):N2}";
        }
        else
        {
            _lblResultado.ForeColor = UiTheme.Exito;
            _lblResultado.Text = $"Vuelto: RD$ {vuelto:N2}";
        }
    }
}