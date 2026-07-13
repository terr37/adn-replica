using System.Text.Json;
using CajaADN.Domain.Interfaces;
using CajaADN.Domain.Models;
using StackExchange.Redis;

namespace CajaADN.Integration.Messaging;

public class RedisPagoService : IPagoService
{
    private readonly IConnectionMultiplexer _redis;

    public RedisPagoService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<(bool Exito, string Mensaje)> IntentarSincronizarAsync(Transaccion transaccion)
    {
        try
        {
            var db = _redis.GetDatabase();

            var mensaje = JsonSerializer.Serialize(new
            {
                transaccion_id = transaccion.TransaccionId.ToString(),
                inmueble_id = transaccion.ReferenciaId,
                monto = transaccion.Monto,
                mes_facturado = transaccion.TimestampLocal.ToString("yyyy-MM"),
            });

            await db.ListRightPushAsync("cola-pagos-municipales", mensaje);
            return (true, "Enviado a Core correctamente.");
        }
        catch (Exception ex)
        {
            return (false, $"Sin conexión con Redis/Core: {ex.Message}");
        }
    }
}