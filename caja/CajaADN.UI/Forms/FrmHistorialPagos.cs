using CajaADN.Application.Services;
using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;
using CajaADN.Domain.Models;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.UI.Forms;

public class FrmHistorialPagos : Form
{
    private readonly SesionService _sesionService;
    private readonly CobroService _cobroService;
    private readonly IAuthService _authService;
    private readonly IDbContextFactory<CajaDbContext> _dbFactory;
    private readonly RolUsuario _rol;

    private readonly DataGridView _dgv = new()
    {
        Dock = DockStyle.Fill,
        AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
        RowHeadersVisible = false,
        AllowUserToAddRows = false,
        ReadOnly = true,
        SelectionMode = DataGridViewSelectionMode.FullRowSelect,
        MultiSelect = false,
    };

    public FrmHistorialPagos(SesionService sesionService, CobroService cobroService, IAuthService authService, IDbContextFactory<CajaDbContext> dbFactory, RolUsuario rol)
    {
        _sesionService = sesionService;
        _cobroService = cobroService;
        _authService = authService;
        _dbFactory = dbFactory;
        _rol = rol;

        Text = "Historial del Turno";
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(920, 560);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader(_rol == RolUsuario.Supervisor
           ? "Historial completo (todos los turnos)"
           : "Historial / Reimprimir / Anular"));

        _dgv.Top = 64;
        _dgv.Height = Height - 64 - 64;
        _dgv.Dock = DockStyle.Fill;

        _dgv.Columns.Add("TransaccionId", "Id");
        _dgv.Columns.Add("Hora", "Hora");
        _dgv.Columns.Add("Contribuyente", "Contribuyente");
        _dgv.Columns.Add("Tipo", "Tipo");
        _dgv.Columns.Add("Monto", "Monto (RD$)");
        _dgv.Columns.Add("Ncf", "NCF");
        _dgv.Columns.Add("Estado", "Estado");
        _dgv.Columns.Add("Sync", "Sync");
        _dgv.Columns["TransaccionId"].Visible = false;

        var pnlBotones = new FlowLayoutPanel { Dock = DockStyle.Bottom, Height = 56, Padding = new Padding(8) };
        var btnReimprimir = UiTheme.BotonPrimario("Reimprimir recibo");
        btnReimprimir.Width = 200;
        btnReimprimir.Click += async (_, _) => await Reimprimir();

        var btnAnular = UiTheme.BotonPrimario("Anular (supervisor)");
        btnAnular.Width = 220;
        btnAnular.BackColor = UiTheme.Peligro;
        btnAnular.Click += async (_, _) => await AnularAsync();

        pnlBotones.Controls.Add(btnReimprimir);
        pnlBotones.Controls.Add(btnAnular);

        var contenedorGrid = new Panel { Dock = DockStyle.Fill, Padding = new Padding(0, 64, 0, 0) };
        contenedorGrid.Controls.Add(_dgv);

        Controls.Add(contenedorGrid);
        Controls.Add(pnlBotones);

        CargarGrid();

        Load += async (_, _) => await CargarGridAsync();
    }

    private async Task CargarGridAsync()
    {
        await using var db = await _dbFactory.CreateDbContextAsync();

        var query = db.Transacciones.AsQueryable();

        if (_rol != RolUsuario.Supervisor)
        {
            query = query.Where(t => t.IdSesion == _sesionService.SesionActual!.IdSesion);
        }

        // Trae los datos SIN ordenar en el SQL (SQLite no soporta ORDER BY sobre DateTimeOffset)
        var transacciones = await query.ToListAsync();

        // Ordena en memoria, ya como objetos .NET
        var ordenadas = transacciones.OrderByDescending(t => t.TimestampLocal).ToList();

        _dgv.Rows.Clear();
        foreach (var t in ordenadas)
        {
            _dgv.Rows.Add(
                t.TransaccionId, t.TimestampLocal.ToString("HH:mm:ss"), t.NombreContribuyente,
                t.Tipo, t.Monto.ToString("N2"), t.NcfSimulado,
                t.Estado == EstadoPago.Anulado ? "ANULADO" : "Pagado",
                t.Sincronizado ? "✔" : "Pendiente");
        }
    }

    private async void CargarGrid()
    {
        // Refresca el estado real desde la BD hacia los objetos en memoria de la sesión
        await using (var db = await _dbFactory.CreateDbContextAsync())
        {
            var ids = _sesionService.SesionActual!.Transacciones.Select(t => t.TransaccionId).ToList();
            var estados = await db.Transacciones
                .Where(t => ids.Contains(t.TransaccionId))
                .ToDictionaryAsync(t => t.TransaccionId, t => new { t.Sincronizado, t.Estado });

            foreach (var t in _sesionService.SesionActual!.Transacciones)
            {
                if (estados.TryGetValue(t.TransaccionId, out var real))
                {
                    t.Sincronizado = real.Sincronizado;
                    t.Estado = real.Estado;
                }
            }
        }

        _dgv.Rows.Clear();
        foreach (var t in _sesionService.SesionActual!.Transacciones.OrderByDescending(t => t.TimestampLocal))
        {
            _dgv.Rows.Add(
                t.TransaccionId, t.TimestampLocal.ToString("HH:mm:ss"), t.NombreContribuyente,
                t.Tipo, t.Monto.ToString("N2"), t.NcfSimulado,
                t.Estado == EstadoPago.Anulado ? "ANULADO" : "Pagado",
                t.Sincronizado ? "✔" : "Pendiente");
        }
    }

    private async Task<Transaccion?> ObtenerSeleccionadaAsync()
    {
        if (_dgv.SelectedRows.Count == 0) return null;
        var id = (Guid)_dgv.SelectedRows[0].Cells["TransaccionId"].Value!;
        await using var db = await _dbFactory.CreateDbContextAsync();
        return await db.Transacciones.FindAsync(id);
    }

    private async Task Reimprimir()
    {
        var t = await ObtenerSeleccionadaAsync();
        if (t is null) { MessageBox.Show("Selecciona una transacción."); return; }

        MessageBox.Show(
            "═══════ REIMPRESIÓN ═══════\n" +
            "Alcaldía del Distrito Nacional\n" +
            $"NCF: {t.NcfSimulado}\n" +
            $"Fecha: {t.TimestampLocal:dd/MM/yyyy HH:mm}\n" +
            $"Contribuyente: {t.NombreContribuyente}\n" +
            $"Tipo: {t.Tipo}\n" +
            $"Monto: RD$ {t.Monto:N2}\n" +
            $"Estado: {t.Estado}\n" +
            "═══════════════════════════",
            "Recibo", MessageBoxButtons.OK, MessageBoxIcon.None);
    }

    private void InitializeComponent()
    {

    }

    private async Task AnularAsync()
    {
        var t = await ObtenerSeleccionadaAsync();
        if (t is null) { MessageBox.Show("Selecciona una transacción."); return; }
        if (t.Estado == EstadoPago.Anulado) { MessageBox.Show("Ya está anulada."); return; }

        using var dlg = new PromptAutorizacionDialog(_authService);
        if (dlg.ShowDialog(this) != DialogResult.OK) return;

        try
        {
            await using var db = await _dbFactory.CreateDbContextAsync();
            var entidad = await db.Transacciones.FindAsync(t.TransaccionId);
            if (entidad is not null)
            {
                entidad.Estado = EstadoPago.Anulado;
                await db.SaveChangesAsync();
            }

            MessageBox.Show("Transacción anulada.", "Anulación", MessageBoxButtons.OK, MessageBoxIcon.Information);
            await CargarGridAsync();
        }
        catch (Exception ex)
        {
            MessageBox.Show($"No se pudo anular: {ex.Message}");
        }
    }
}