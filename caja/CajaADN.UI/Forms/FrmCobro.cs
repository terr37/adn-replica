using CajaADN.Application.Services;
using CajaADN.Domain.Enums;
using CajaADN.Domain.Models;
using CajaADN.Integration.Data;
using CajaADN.UI.Services;

using Microsoft.EntityFrameworkCore;
using System.IO;

namespace CajaADN.UI.Forms;

public class FrmCobro : Form
{
    private readonly SesionService _sesionService;
    private readonly CobroService _cobroService;
    private readonly IDbContextFactory<CajaDbContext> _dbFactory;

    private class OpcionTipoPago
    {
        public TipoPago Valor { get; init; }
        public string Etiqueta { get; init; } = string.Empty;
        public override string ToString() => Etiqueta;
    }

    private readonly RadioButton _rbEfectivo = new() { Text = "Efectivo", Checked = true, AutoSize = true };
    private readonly RadioButton _rbTarjeta = new() { Text = "Tarjeta", AutoSize = true };
    private readonly TextBox _txtCedula = new() { Dock = DockStyle.Fill };
    private readonly ComboBox _cmbTipo = new() { DropDownStyle = ComboBoxStyle.DropDownList, Dock = DockStyle.Fill };
    private readonly ComboBox _cmbInmueble = new() { DropDownStyle = ComboBoxStyle.DropDownList, Dock = DockStyle.Fill, DisplayMember = "InmuebleId" };
    private readonly TextBox _txtNombre = new() { Dock = DockStyle.Fill };
    private readonly TextBox _txtDescripcion = new() { Dock = DockStyle.Fill };
    private readonly TextBox _txtMonto = new() { Dock = DockStyle.Fill };
    private readonly Button _btnCobrar = new() { Text = "Cobrar y Emitir NCF", Height = 40 };
    private readonly Button _btnCalcularVuelto = new()
    {
        Text = "Calcular Vuelto",
        Height = 40
    };

    private string _referenciaId = string.Empty;

    public FrmCobro(SesionService sesionService, CobroService cobroService, IDbContextFactory<CajaDbContext> dbFactory)
    {
        _sesionService = sesionService;
        _cobroService = cobroService;
        _dbFactory = dbFactory;

        Text = "Cobro de Tasas Municipales";
        StartPosition = FormStartPosition.CenterParent;
        Size = new Size(500, 480);
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;

        var tlp = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 9,
            Padding = new Padding(16)
        }; tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 40F));
        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 60F));

        for (int i = 0; i < 9; i++)
        {
            tlp.RowStyles.Add(new RowStyle(SizeType.Absolute, 45F));
        }

        var opciones = Enum.GetValues<TipoPago>()
            .Select(t => new OpcionTipoPago { Valor = t, Etiqueta = t.NombreVisible() })
            .OrderBy(o => o.Etiqueta)
            .ToList();
        _cmbTipo.DataSource = opciones;
        _cmbTipo.DisplayMember = "Etiqueta";
        _cmbTipo.SelectedIndexChanged += (_, _) => ActualizarVisibilidadCampos();

        tlp.Controls.Add(new Label { Text = "Tipo de pago:", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 0);
        tlp.Controls.Add(_cmbTipo, 1, 0);

        tlp.Controls.Add(new Label { Text = "Inmueble (solo Aseo):", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 1);
        _cmbInmueble.SelectedIndexChanged += (_, _) => CalcularMontoAseo();
        tlp.Controls.Add(_cmbInmueble, 1, 1);

        tlp.Controls.Add(new Label { Text = "Nombre contribuyente:", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 2);
        tlp.Controls.Add(_txtNombre, 1, 2);

        tlp.Controls.Add(new Label { Text = "Cédula:", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 3);
        tlp.Controls.Add(_txtCedula, 1, 3);

        tlp.Controls.Add(new Label { Text = "Descripción:", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 4);
        tlp.Controls.Add(_txtDescripcion, 1, 4);

        tlp.Controls.Add(new Label { Text = "Monto (RD$):", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 5);
        tlp.Controls.Add(_txtMonto, 1, 5);

        var panelMetodo = new FlowLayoutPanel { Dock = DockStyle.Fill, AutoSize = true, FlowDirection = FlowDirection.LeftToRight };
        panelMetodo.Controls.Add(_rbEfectivo);
        panelMetodo.Controls.Add(_rbTarjeta);
        tlp.Controls.Add(new Label { Text = "Método de pago:", Anchor = AnchorStyles.Left | AnchorStyles.Right, AutoSize = true }, 0, 6);
        tlp.Controls.Add(panelMetodo, 1, 6);

        tlp.Controls.Add(_btnCalcularVuelto, 0, 7);
        tlp.SetColumnSpan(_btnCalcularVuelto, 2);
        _btnCalcularVuelto.Dock = DockStyle.Fill;

        _btnCobrar.Click += async (_, _) => await CobrarAsync();
        tlp.Controls.Add(_btnCobrar, 0, 8);
        tlp.SetColumnSpan(_btnCobrar, 2);
        _btnCobrar.Dock = DockStyle.Fill;

        _btnCalcularVuelto.Click += (_, _) =>
        {
            if (!decimal.TryParse(_txtMonto.Text, out decimal monto))
            {
                MessageBox.Show("Ingrese un monto válido.");
                return;
            }

            using var frm = new FrmCalcularVuelto(monto);
            frm.ShowDialog(this);
        };
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
        _txtMonto.Enabled = true;
        _txtMonto.Text = "0.00";
        _referenciaId = string.Empty;
        if (esAseo) CalcularMontoAseo();
    }

    private void CalcularMontoAseo()
    {
        if (_cmbTipo.SelectedItem is null || TipoSeleccionado != TipoPago.PAGO_ASEO_URBANO) return;
        if (_cmbInmueble.SelectedItem is InmuebleCatastro inmueble)
        {
            _referenciaId = inmueble.InmuebleId;
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
            var transaccion = await _cobroService.CobrarAsync(
                TipoSeleccionado, 
                _referenciaId, 
                _txtNombre.Text.Trim(), 
                _txtCedula.Text.Trim(), 
                monto, 
                metodo,
                _txtDescripcion.Text.Trim()
            );

            await using (var db = await _dbFactory.CreateDbContextAsync())
            {
                db.Transacciones.Add(transaccion);
                await db.SaveChangesAsync();
            }

            GenerarRecibo(transaccion, _sesionService.SesionActual!.UsuarioCajero);

            // Generar el PDF local en la carpeta Recibos
            var carpetaRecibos = Path.Combine(AppContext.BaseDirectory, "Recibos");
            Directory.CreateDirectory(carpetaRecibos);
            var rutaPdfLocal = Path.Combine(carpetaRecibos, $"{transaccion.NcfSimulado}.pdf");

            try
            {
                PdfReportService.GenerarReciboPdf(transaccion, _sesionService.SesionActual!.UsuarioCajero, rutaPdfLocal);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al generar el PDF local del recibo: {ex.Message}", "Error PDF", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            // Preguntar si desea guardar el PDF en el equipo
            using (var sfd = new SaveFileDialog
            {
                Filter = "Archivos PDF (*.pdf)|*.pdf",
                FileName = $"{transaccion.NcfSimulado}.pdf",
                Title = "Guardar Factura en PDF"
            })
            {
                if (sfd.ShowDialog(this) == DialogResult.OK)
                {
                    try
                    {
                        File.Copy(rutaPdfLocal, sfd.FileName, true);

                        var result = MessageBox.Show(
                            "Factura guardada en PDF con éxito.\n¿Desea abrirla para imprimirla?", 
                            "Imprimir Factura", 
                            MessageBoxButtons.YesNo, 
                            MessageBoxIcon.Question
                        );

                        if (result == DialogResult.Yes)
                        {
                            var ps = new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = sfd.FileName,
                                UseShellExecute = true
                            };
                            System.Diagnostics.Process.Start(ps);
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show($"Error al guardar el PDF en la ubicación seleccionada: {ex.Message}", "Error Guardar", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }

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
            $"Descripción:    {t.Descripcion}\n" +
            $"Monto:          RD$ {t.Monto:N2}\n" +
            "═══════════════════════════════\n";

        File.WriteAllText(ruta, contenido);
    }
}