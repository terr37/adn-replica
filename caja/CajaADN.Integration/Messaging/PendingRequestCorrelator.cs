using System.Collections.Concurrent;

namespace CajaADN.Integration.Messaging;

public class PendingRequestCorrelator
{
    private readonly ConcurrentDictionary<Guid, object> _pendientes = new();

    public Task<TReply> EsperarAsync<TReply>(Guid correlationId, TimeSpan timeout)
    {
        var tcs = new TaskCompletionSource<TReply>(TaskCreationOptions.RunContinuationsAsynchronously);
        _pendientes[correlationId] = tcs;

        var cts = new CancellationTokenSource(timeout);
        cts.Token.Register(() =>
        {
            if (_pendientes.TryRemove(correlationId, out _))
                tcs.TrySetException(new TimeoutException("Integración no respondió a tiempo."));
        });

        return tcs.Task;
    }

    public void Completar<TReply>(Guid correlationId, TReply respuesta)
    {
        if (_pendientes.TryRemove(correlationId, out var boxed) && boxed is TaskCompletionSource<TReply> tcs)
            tcs.TrySetResult(respuesta);
    }
}