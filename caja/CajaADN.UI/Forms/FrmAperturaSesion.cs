using CajaADN.UI;

public class FrmAperturaSesion : Form
{
    private const decimal EfectivoFijoPorDefecto = 5000.00m;
    private readonly TextBox _txtEfectivo = new() { Dock = DockStyle.Fill, Text = EfectivoFijoPorDefecto.ToString("0.00") };

    public decimal EfectivoInicial { get; private set; }

    public FrmAperturaSesion(string nombreCajero)
    {
        Text = "Apertura de Turno";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        Size = new Size(400, 260);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Apertura de Turno"));

        var lbl = new Label
        {
            Text = $"Cajero: {nombreCajero}\nFecha: {DateTime.Now:dd/MM/yyyy HH:mm}",
            Dock = DockStyle.Top,
            Height = 70,
            Padding = new Padding(20, 80, 20, 0),
            Font = new Font("Segoe UI", 10),
        };

        var tlp = new TableLayoutPanel { Dock = DockStyle.Top, ColumnCount = 2, Height = 40, Padding = new Padding(20, 0, 20, 0) };
        tlp.Controls.Add(new Label { Text = "Efectivo inicial (RD$):", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        tlp.Controls.Add(_txtEfectivo, 1, 0);

        var btnAbrir = UiTheme.BotonPrimario("Iniciar Turno");
        btnAbrir.Dock = DockStyle.Bottom;
        btnAbrir.Margin = new Padding(20);
        btnAbrir.Click += (_, _) =>
        {
            if (!decimal.TryParse(_txtEfectivo.Text, out var efectivo) || efectivo < 0)
            {
                MessageBox.Show("Ingrese un monto de efectivo válido.");
                return;
            }
            EfectivoInicial = efectivo;
            DialogResult = DialogResult.OK;
            Close();
        };

        Controls.Add(lbl);
        Controls.Add(tlp);
        Controls.Add(btnAbrir);
        AcceptButton = btnAbrir;
    }
}