using CajaADN.Contracts.Commands;
using CajaADN.Contracts.Replies;
using CajaADN.Domain.Interfaces;
using CajaADN.Domain.Models;
using NServiceBus;

namespace CajaADN.Integration.Messaging;

public class NsbPagoService : IPagoService
{
    private readonly IMessageSession _session;
    private readonly PendingRequestCorrelator _correlator;

    public NsbPagoService(IMessageSession session, PendingRequestCorrelator correlator)
    {
        _session = session;
        _correlator = correlator;
    }

    public async Task<(bool Exito, string Mensaje)> IntentarSincronizarAsync(Transaccion transaccion)
    {
        var esperaReply = _correlator.EsperarAsync<PagoRegistradoReply>(
            transaccion.TransaccionId, TimeSpan.FromSeconds(10));

        try
        {
            await _session.Send(new RegistrarPagoCommand
            {
                TransaccionId = transaccion.TransaccionId,
                Tipo = transaccion.Tipo.ToString(),
                ReferenciaId = transaccion.ReferenciaId,
                NombreContribuyente = transaccion.NombreContribuyente,
                Monto = transaccion.Monto,
                Moneda = transaccion.Moneda,
                NcfSimulado = transaccion.NcfSimulado,
                Origen = transaccion.Origen,
                TimestampLocal = transaccion.TimestampLocal,
            });

            var reply = await esperaReply;
            return (reply.Exito, reply.Message ?? (reply.Exito ? "Sincronizado." : "Rechazado por Integración."));
        }
        catch (Exception ex)
        {
            return (false, $"Sin conexión con Integración: {ex.Message}");
        }
    }
}