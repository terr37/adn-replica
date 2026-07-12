using CajaADN.Contracts.Replies;
using CajaADN.Integration.Messaging;
using NServiceBus;

namespace CajaADN.Integration.Handlers;

public class PagoRegistradoReplyHandler : IHandleMessages<PagoRegistradoReply>
{
    private readonly PendingRequestCorrelator _correlator;
    public PagoRegistradoReplyHandler(PendingRequestCorrelator correlator) => _correlator = correlator;

    public Task Handle(PagoRegistradoReply message, IMessageHandlerContext context)
    {
        _correlator.Completar(message.TransaccionId, message);
        return Task.CompletedTask;
    }
}