using CajaADN.Application.Services;
using CajaADN.Domain.Enums;
using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace CajaADN.UI.Forms;

public class FrmPrincipal : Form
{
    private readonly SesionService _sesionService;
    private readonly CobroService _cobroService;
    private readonly IAuthService _authService;
    private readonly IDbContextFactory<CajaDbContext> _dbFactory;
    private readonly RolUsuario _rol;   // ← nuevo

    public FrmPrincipal(SesionService sesionService, CobroService cobroService, IAuthService authService, IDbContextFactory<CajaDbContext> dbFactory, RolUsuario rol)
    {
        _sesionService = sesionService;
        _cobroService = cobroService;
        _authService = authService;
        _dbFactory = dbFactory;
        _rol = rol;

        Text = $"Caja ADN — Cajero: {sesionService.SesionActual!.UsuarioCajero}";
        WindowState = FormWindowState.Maximized;
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader($"Turno abierto — {sesionService.SesionActual!.FechaApertura:dd/MM/yyyy HH:mm}"));

        var panel = new FlowLayoutPanel { Dock = DockStyle.Fill, Padding = new Padding(32, 96, 32, 32), FlowDirection = FlowDirection.TopDown };

        var btnCobro = UiTheme.BotonMenu("💵  Cobrar Tasas Municipales");
        btnCobro.Click += (_, _) => new FrmCobro(_cobroService, _dbFactory).ShowDialog(this);
        panel.Controls.Add(btnCobro);

        var btnHistorial = UiTheme.BotonMenu("🧾  Historial / Reimprimir / Anular");
        btnHistorial.Click += (_, _) => new FrmHistorialPagos(_sesionService, _cobroService, _authService, _dbFactory, _rol).ShowDialog(this);
        panel.Controls.Add(btnHistorial);

        var btnCierre = UiTheme.BotonMenu("🔒  Cerrar Turno");
        btnCierre.Click += (_, _) =>
        {
            if (new FrmCierreSesion(_sesionService, _dbFactory).ShowDialog(this) == DialogResult.OK) Close();
        };
        panel.Controls.Add(btnCierre);

        Controls.Add(panel);
    }
}