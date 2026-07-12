using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;

namespace CajaADN.UI.Forms;

public class FrmLogin : Form
{
    private readonly IAuthService _authService;
    private readonly TextBox _txtUsuario = new() { Dock = DockStyle.Fill, Font = new Font("Segoe UI", 10) };
    private readonly TextBox _txtClave = new() { Dock = DockStyle.Fill, PasswordChar = '•', Font = new Font("Segoe UI", 10) };
    private readonly Label _lblError = new() { ForeColor = UiTheme.Peligro, Dock = DockStyle.Fill, TextAlign = ContentAlignment.MiddleCenter };
    private readonly Button _btnEntrar = UiTheme.BotonPrimario("Entrar");

    public string? Usuario { get; private set; }
    public RolUsuario? Rol { get; private set; }

    public FrmLogin(IAuthService authService)
    {
        _authService = authService;
        Text = "Caja ADN — Iniciar sesión";
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        Size = new Size(400, 300);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Acceso de Cajero"));

        var tlp = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 1, Padding = new Padding(24, 80, 24, 16), RowCount = 5 };
        tlp.Controls.Add(new Label { Text = "Usuario", Font = new Font("Segoe UI", 9, FontStyle.Bold) });
        tlp.Controls.Add(_txtUsuario);
        tlp.Controls.Add(new Label { Text = "Clave", Font = new Font("Segoe UI", 9, FontStyle.Bold) });
        tlp.Controls.Add(_txtClave);
        tlp.Controls.Add(_lblError);
        tlp.Controls.Add(_btnEntrar);

        _btnEntrar.Click += async (_, _) => await IntentarLoginAsync();
        AcceptButton = _btnEntrar;
        Controls.Add(tlp);
    }

    private async Task IntentarLoginAsync()
    {
        _btnEntrar.Enabled = false;
        var (exito, usuario, rol) = await _authService.LoginAsync(_txtUsuario.Text.Trim(), _txtClave.Text);
        if (!exito)
        {
            _lblError.Text = "Usuario o clave incorrectos.";
            _btnEntrar.Enabled = true;
            return;
        }
        Usuario = usuario;
        Rol = rol;
        DialogResult = DialogResult.OK;
        Close();
    }
}