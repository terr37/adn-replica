namespace CajaADN.Contracts.Commands;

public class RegistrarPagoCommand : NServiceBus.ICommand
{
    public Guid TransaccionId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string ReferenciaId { get; set; } = string.Empty;
    public string NombreContribuyente { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public string Moneda { get; set; } = "DOP";
    public string NcfSimulado { get; set; } = string.Empty;
    public string Origen { get; set; } = "CAJA_OFFLINE";
    public DateTimeOffset TimestampLocal { get; set; }
}