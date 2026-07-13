namespace CajaADN.UI.Forms;

public class FrmAperturaSesion : Form
{
    public FrmAperturaSesion(string nombreCajero)
    {
        Text = "Apertura de Turno";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        Size = new Size(380, 220);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Apertura de Turno"));

        var lbl = new Label
        {
            Text = $"Cajero: {nombreCajero}\nFecha: {DateTime.Now:dd/MM/yyyy HH:mm}\n\n¿Iniciar el turno ahora?",
            Dock = DockStyle.Fill,
            Padding = new Padding(20, 80, 20, 0),
            Font = new Font("Segoe UI", 10),
        };

        var btnAbrir = UiTheme.BotonPrimario("Iniciar Turno");
        btnAbrir.Dock = DockStyle.Bottom;
        btnAbrir.Margin = new Padding(20);
        btnAbrir.Click += (_, _) => { DialogResult = DialogResult.OK; Close(); };

        Controls.Add(lbl);
        Controls.Add(btnAbrir);
        AcceptButton = btnAbrir;
    }
}