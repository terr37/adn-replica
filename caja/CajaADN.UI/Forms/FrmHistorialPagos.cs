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

    public FrmHistorialPagos(SesionService sesionService, CobroService cobroService, IAuthService authService, IDbContextFactory<CajaDbContext> dbFactory)
    {
        _sesionService = sesionService;
        _cobroService = cobroService;
        _authService = authService;
        _dbFactory = dbFactory;

        Text = "Historial del Turno";
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(920, 560);
        BackColor = UiTheme.FondoClaro;

        Controls.Add(UiTheme.CrearHeader("Historial / Reimprimir / Anular"));

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
        btnReimprimir.Click += (_, _) => Reimprimir();

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
    }

    private void CargarGrid()
    {
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

    private Transaccion? ObtenerSeleccionada()
    {
        if (_dgv.SelectedRows.Count == 0) return null;
        var id = (Guid)_dgv.SelectedRows[0].Cells["TransaccionId"].Value!;
        return _sesionService.SesionActual!.Transacciones.FirstOrDefault(t => t.TransaccionId == id);
    }

    private void Reimprimir()
    {
        var t = ObtenerSeleccionada();
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

    private async Task AnularAsync()
    {
        var t = ObtenerSeleccionada();
        if (t is null) { MessageBox.Show("Selecciona una transacción."); return; }
        if (t.Estado == EstadoPago.Anulado) { MessageBox.Show("Ya está anulada."); return; }

        using var dlg = new PromptAutorizacionDialog(_authService);
        if (dlg.ShowDialog(this) != DialogResult.OK) return;

        try
        {
            _cobroService.AnularTransaccion(t, dlg.UsuarioAutoriza, dlg.Motivo);

            await using var db = await _dbFactory.CreateDbContextAsync();
            var entidad = await db.Transacciones.FindAsync(t.TransaccionId);
            if (entidad is not null)
            {
                entidad.Estado = EstadoPago.Anulado;
                await db.SaveChangesAsync();
            }

            MessageBox.Show("Transacción anulada.", "Anulación", MessageBoxButtons.OK, MessageBoxIcon.Information);
            CargarGrid();
        }
        catch (Exception ex)
        {
            MessageBox.Show($"No se pudo anular: {ex.Message}");
        }
    }
}