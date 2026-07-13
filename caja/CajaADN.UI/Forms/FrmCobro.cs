using CajaADN.Application.Services;
using CajaADN.Domain.Enums;
using CajaADN.Domain.Models;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.UI.Forms;

public class FrmCobro : Form
{
    private readonly CobroService _cobroService;
    private readonly IDbContextFactory<CajaDbContext> _dbFactory;

    private readonly ComboBox _cmbTipo = new() { DropDownStyle = ComboBoxStyle.DropDownList, Dock = DockStyle.Fill };
    private readonly ComboBox _cmbInmueble = new() { DropDownStyle = ComboBoxStyle.DropDownList, Dock = DockStyle.Fill, DisplayMember = "InmuebleId" };
    private readonly TextBox _txtReferenciaId = new() { Dock = DockStyle.Fill };
    private readonly TextBox _txtNombre = new() { Dock = DockStyle.Fill };
    private readonly TextBox _txtMonto = new() { Dock = DockStyle.Fill };
    private readonly Button _btnCobrar = new() { Text = "Cobrar y Emitir NCF", Height = 40 };

    public FrmCobro(CobroService cobroService, IDbContextFactory<CajaDbContext> dbFactory)
    {
        _cobroService = cobroService;
        _dbFactory = dbFactory;

        Text = "Cobro de Tasas Municipales";
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(480, 420);

        var tlp = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(16) };
        _cmbTipo.Items.AddRange(Enum.GetValues<TipoPago>().Cast<object>().ToArray());
        _cmbTipo.SelectedIndexChanged += (_, _) => ActualizarVisibilidadCampos();
        tlp.Controls.Add(new Label { Text = "Tipo de pago:" }, 0, 0);
        tlp.Controls.Add(_cmbTipo, 1, 0);

        tlp.Controls.Add(new Label { Text = "Inmueble (solo Aseo):" }, 0, 1);
        _cmbInmueble.SelectedIndexChanged += (_, _) => CalcularMontoAseo();
        tlp.Controls.Add(_cmbInmueble, 1, 1);

        tlp.Controls.Add(new Label { Text = "Referencia (solicitud/fosa):" }, 0, 2);
        tlp.Controls.Add(_txtReferenciaId, 1, 2);

        tlp.Controls.Add(new Label { Text = "Nombre contribuyente:" }, 0, 3);
        tlp.Controls.Add(_txtNombre, 1, 3);

        tlp.Controls.Add(new Label { Text = "Monto (RD$):" }, 0, 4);
        tlp.Controls.Add(_txtMonto, 1, 4);

        _btnCobrar.Click += async (_, _) => await CobrarAsync();
        tlp.Controls.Add(_btnCobrar, 0, 5);
        tlp.SetColumnSpan(_btnCobrar, 2);

        Controls.Add(tlp);
        Load += async (_, _) => await CargarCatastroAsync();
        _cmbTipo.SelectedIndex = 0;
    }

    private async Task CargarCatastroAsync()
    {
        var lista = await _cobroService.ObtenerCatastroAsync();
        _cmbInmueble.DataSource = lista.ToList();
    }

    private void ActualizarVisibilidadCampos()
    {
        var esAseo = (TipoPago)_cmbTipo.SelectedItem! == TipoPago.PAGO_ASEO_URBANO;
        _cmbInmueble.Enabled = esAseo;
        _txtMonto.Enabled = !esAseo;
        if (esAseo) CalcularMontoAseo();
    }

    private void CalcularMontoAseo()
    {
        if (_cmbInmueble.SelectedItem is InmuebleCatastro inmueble)
        {
            _txtReferenciaId.Text = inmueble.InmuebleId;
            _txtMonto.Text = inmueble.TarifaMensual.ToString("0.00");
        }
    }

    private async Task CobrarAsync()
    {
        if (!decimal.TryParse(_txtMonto.Text, out var monto) || monto <= 0)
        {
            MessageBox.Show("Monto inválido."); return;
        }
        if (string.IsNullOrWhiteSpace(_txtNombre.Text))
        {
            MessageBox.Show("Ingrese el nombre del contribuyente."); return;
        }

        _btnCobrar.Enabled = false;
        try
        {
            var tipo = (TipoPago)_cmbTipo.SelectedItem!;
            var transaccion = await _cobroService.CobrarAsync(tipo, _txtReferenciaId.Text.Trim(), _txtNombre.Text.Trim(), monto);

            await using (var db = await _dbFactory.CreateDbContextAsync())
            {
                db.Transacciones.Add(transaccion);
                await db.SaveChangesAsync();
            }

            MessageBox.Show(
                $"COBRADO ✔\n\nNCF: {transaccion.NcfSimulado}\nMonto: RD$ {transaccion.Monto:N2}\n\n" +
                "Se sincronizará con Integración automáticamente.",
                "Recibo", MessageBoxButtons.OK, MessageBoxIcon.Information);

            DialogResult = DialogResult.OK;
        }
        finally
        {
            _btnCobrar.Enabled = true;
        }
    }
}