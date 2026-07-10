using System;
using NServiceBus;

namespace Core.Messages.Commands
{
    // Command = "hazlo": Caja le ordena al Core que procese un pago.
    // Solo puede haber UN handler para este comando (en Core).
    public class ProcesarPagoCommand : ICommand
    {
        public Guid TransaccionId { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string InmuebleId { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = string.Empty;
        public string NcfSimulado { get; set; } = string.Empty;
        public string Origen { get; set; } = string.Empty;
        public DateTime TimestampLocal { get; set; }
    }
}
