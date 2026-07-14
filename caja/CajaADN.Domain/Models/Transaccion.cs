using CajaADN.Domain.Enums;

namespace CajaADN.Domain.Models;

public class Transaccion
{
    public Guid TransaccionId { get; set; } = Guid.NewGuid();
    public Guid IdSesion { get; set; }
    public TipoPago Tipo { get; set; }
    public string ReferenciaId { get; set; } = string.Empty;
    public string NombreContribuyente { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public string Moneda { get; set; } = "DOP";
    public string NcfSimulado { get; set; } = string.Empty;
    public string Origen { get; set; } = "CAJA_OFFLINE";
    public DateTimeOffset TimestampLocal { get; set; } = DateTimeOffset.Now;
    public EstadoPago Estado { get; set; } = EstadoPago.Pagado;
    public bool Sincronizado { get; set; } = false;
    public int IntentosSincronizacion { get; set; }
    public DateTime? UltimoIntentoSincronizacion { get; set; }

    public string Cedula { get; set; } = string.Empty;   // ← nuevo
    public MetodoPago MetodoPago { get; set; } = MetodoPago.Efectivo;
}