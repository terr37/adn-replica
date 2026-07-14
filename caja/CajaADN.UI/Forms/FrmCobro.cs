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

    // Envuelve el enum para poder mostrar un texto legible en el ComboBox
    // sin perder el valor real de TipoPago.
    private class OpcionTipoPago
    {
        public TipoPago Valor { get; init; }
        public string Etiqueta { get; init; } = string.Empty;
        public override string ToString() => Etiqueta;
    }
    private readonly RadioButton _rbEfectivo = new() { Text = "Efectivo", Checked = true, AutoSize = true };
    private readonly RadioButton _rbTarjeta = new() { Text = "Tarjeta", AutoSize = true };
    private readonly SesionService _sesionService;
    private readonly TextBox _txtCedula = new() { Dock = DockStyle.Fill };
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
        Size = new Size(500, 440);

        var tlp = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(16) };

        var opciones = Enum.GetValues<TipoPago>()
            .Select(t => new OpcionTipoPago { Valor = t, Etiqueta = t.NombreVisible() })
            .OrderBy(o => o.Etiqueta)
            .ToList();
        _cmbTipo.DataSource = opciones;
        _cmbTipo.DisplayMember = "Etiqueta";
        _cmbTipo.SelectedIndexChanged += (_, _) => ActualizarVisibilidadCampos();
        tlp.Controls.Add(new Label { Text = "Tipo de pago:" }, 0, 0);
        tlp.Controls.Add(_cmbTipo, 1, 0);

        tlp.Controls.Add(new Label { Text = "Inmueble (solo Aseo):" }, 0, 1);
        _cmbInmueble.SelectedIndexChanged += (_, _) => CalcularMontoAseo();
        tlp.Controls.Add(_cmbInmueble, 1, 1);

        tlp.Controls.Add(new Label { Text = "Referencia (solicitud/fosa/etc.):" }, 0, 2);
        tlp.Controls.Add(_txtReferenciaId, 1, 2);

        tlp.Controls.Add(new Label { Text = "Monto (RD$):" }, 0, 5);
        tlp.Controls.Add(_txtMonto, 1, 5);

        var panelMetodo = new FlowLayoutPanel { Dock = DockStyle.Fill, AutoSize = true };
        panelMetodo.Controls.Add(_rbEfectivo);
        panelMetodo.Controls.Add(_rbTarjeta);
        tlp.Controls.Add(new Label { Text = "Método de pago:" }, 0, 6);
        tlp.Controls.Add(panelMetodo, 1, 6);

        tlp.Controls.Add(new Label { Text = "Nombre contribuyente:" }, 0, 3);
        tlp.Controls.Add(_txtNombre, 1, 3);

        tlp.Controls.Add(new Label { Text = "Monto (RD$):" }, 0, 4);
        tlp.Controls.Add(_txtMonto, 1, 4);

        _btnCobrar.Click += async (_, _) => await CobrarAsync();
        tlp.Controls.Add(_btnCobrar, 0, 5);
        tlp.Controls.Add(_btnCobrar, 0, 7);

        tlp.Controls.Add(new Label { Text = "Cédula:" }, 0, 4);
        tlp.Controls.Add(_txtCedula, 1, 4);
        // corre los índices de fila de Monto (0,5)/(1,5) y el botón (0,6) un renglón hacia abajo

        Controls.Add(tlp);
        Load += async (_, _) => await CargarCatastroAsync();
    }

    private TipoPago TipoSeleccionado => ((OpcionTipoPago)_cmbTipo.SelectedItem!).Valor;

    private async Task CargarCatastroAsync()
    {
        var lista = await _cobroService.ObtenerCatastroAsync();
        _cmbInmueble.DataSource = lista.ToList();
        ActualizarVisibilidadCampos();
    }

    private void ActualizarVisibilidadCampos()
    {
        if (_cmbTipo.SelectedItem is null) return;
        var esAseo = TipoSeleccionado == TipoPago.PAGO_ASEO_URBANO;
        _cmbInmueble.Enabled = esAseo;
        _txtMonto.Enabled = true; // siempre editable; el cálculo de Aseo es solo una sugerencia
        if (esAseo) CalcularMontoAseo();
    }

    private void CalcularMontoAseo()
    {
        if (_cmbTipo.SelectedItem is null || TipoSeleccionado != TipoPago.PAGO_ASEO_URBANO) return;
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
        if (string.IsNullOrWhiteSpace(_txtCedula.Text))
        {
            MessageBox.Show("Ingrese la cédula del contribuyente."); return;
        }

        var metodo = _rbTarjeta.Checked ? MetodoPago.Tarjeta : MetodoPago.Efectivo;

        if (metodo == MetodoPago.Tarjeta)
        {
            using var frmTarjeta = new FrmSimulacionTarjeta(monto);
            if (frmTarjeta.ShowDialog(this) != DialogResult.OK || !frmTarjeta.Aprobado)
            {
                MessageBox.Show("Pago con tarjeta no completado."); return;
            }
        }

        _btnCobrar.Enabled = false;
        try
        {
            var transaccion = await _cobroService.CobrarAsync(TipoSeleccionado, _txtReferenciaId.Text.Trim(), _txtNombre.Text.Trim(), _txtCedula.Text.Trim(), monto, metodo);
            await using (var db = await _dbFactory.CreateDbContextAsync())
            {
                db.Transacciones.Add(transaccion);
                await db.SaveChangesAsync();
            }

            GenerarRecibo(transaccion, _sesionService.SesionActual!.UsuarioCajero);

            MessageBox.Show(
                $"COBRADO ✔\n\nServicio: {TipoSeleccionado.NombreVisible()}\nNCF: {transaccion.NcfSimulado}\nMonto: RD$ {transaccion.Monto:N2}\n\n" +
                "Se sincronizará con Integración automáticamente.",
                "Recibo", MessageBoxButtons.OK, MessageBoxIcon.Information);

            DialogResult = DialogResult.OK;
        }
        finally
        {
            _btnCobrar.Enabled = true;
        }
    }
    private static void GenerarRecibo(Transaccion t, string cajero)
    {
        var carpeta = Path.Combine(AppContext.BaseDirectory, "Recibos");
        Directory.CreateDirectory(carpeta);
        var ruta = Path.Combine(carpeta, $"{t.NcfSimulado}.txt");

        var contenido =
            "═══════════════════════════════\n" +
            "  ALCALDÍA DEL DISTRITO NACIONAL\n" +
            "═══════════════════════════════\n" +
            $"NCF:            {t.NcfSimulado}\n" +
            $"Fecha:          {t.TimestampLocal:dd/MM/yyyy HH:mm}\n" +
            $"Cajero:         {cajero}\n" +
            $"Contribuyente:  {t.NombreContribuyente}\n" +
            $"Cédula:         {t.Cedula}\n" +
            $"Tipo de pago:   {t.Tipo}\n" +
            $"Referencia:     {t.ReferenciaId}\n" +
            $"Monto:          RD$ {t.Monto:N2}\n" +
            "═══════════════════════════════\n";

        File.WriteAllText(ruta, contenido);
    }
}