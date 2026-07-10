using System;
using NServiceBus;

namespace Core.Messages.Events
{
    // Event = "esto pasó": Core avisa que ya terminó de procesar el pago.
    // Cero o varios suscriptores pueden reaccionar (Web, futuros reportes, etc.)
    public class PagoProcesadoEvent : IEvent
    {
        public Guid TransaccionId { get; set; }
        public string InmuebleId { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public DateTime FechaProcesado { get; set; }
    }
}
