using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;

namespace CajaADN.UI.Forms;

public class PromptAutorizacionDialog : Form
{
    private readonly IAuthService _authService;
    private readonly TextBox _txtMotivo = new() { Dock = DockStyle.Fill, Multiline = true, Height = 60 };
    private readonly TextBox _txtUsuario = new() { Dock = DockStyle.Fill };
    private readonly TextBox _txtClave = new() { Dock = DockStyle.Fill, PasswordChar = '•' };
    private readonly Label _lblError = new() { ForeColor = UiTheme.Peligro, Dock = DockStyle.Fill };

    public string UsuarioAutoriza { get; private set; } = string.Empty;
    public string Motivo { get; private set; } = string.Empty;

    public PromptAutorizacionDialog(IAuthService authService)
    {
        _authService = authService;
        Text = "Autorización de Supervisor";
        StartPosition = FormStartPosition.CenterParent;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        Size = new Size(420, 340);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Se requiere autorización"));

        var tlp = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(16, 80, 16, 16) };
        tlp.Controls.Add(new Label { Text = "Motivo:" }, 0, 0);
        tlp.Controls.Add(_txtMotivo, 1, 0);
        tlp.Controls.Add(new Label { Text = "Usuario Supervisor:" }, 0, 1);
        tlp.Controls.Add(_txtUsuario, 1, 1);
        tlp.Controls.Add(new Label { Text = "Clave:" }, 0, 2);
        tlp.Controls.Add(_txtClave, 1, 2);
        tlp.Controls.Add(_lblError, 0, 3);
        tlp.SetColumnSpan(_lblError, 2);

        var btnAutorizar = UiTheme.BotonPrimario("Autorizar Anulación");
        btnAutorizar.Click += async (_, _) => await AutorizarAsync();
        tlp.Controls.Add(btnAutorizar, 0, 4);
        tlp.SetColumnSpan(btnAutorizar, 2);

        AcceptButton = btnAutorizar;
        Controls.Add(tlp);
    }

    private async Task AutorizarAsync()
    {
        if (string.IsNullOrWhiteSpace(_txtMotivo.Text))
        {
            _lblError.Text = "Indique el motivo de la anulación.";
            return;
        }

        var (exito, _, rol) = await _authService.LoginAsync(_txtUsuario.Text.Trim(), _txtClave.Text);
        if (!exito || rol != RolUsuario.Supervisor)
        {
            _lblError.Text = "Usuario/clave inválidos, o el usuario no es Supervisor.";
            return;
        }

        UsuarioAutoriza = _txtUsuario.Text.Trim();
        Motivo = _txtMotivo.Text.Trim();
        DialogResult = DialogResult.OK;
        Close();
    }
}