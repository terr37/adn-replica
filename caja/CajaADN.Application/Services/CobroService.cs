using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;
using CajaADN.Domain.Models;

namespace CajaADN.Application.Services;

public class CobroService
{
    private readonly ICatastroService _catastroService;
    private readonly SesionService _sesionService;

    public CobroService(ICatastroService catastroService, SesionService sesionService)
    {
        _catastroService = catastroService;
        _sesionService = sesionService;
    }

    public Task<IReadOnlyList<InmuebleCatastro>> ObtenerCatastroAsync() =>
        _catastroService.ObtenerCatastroAsync();

    private static int _consecutivoNcf = 100;
    private static string GenerarNcfSimulado() => $"B02{System.Threading.Interlocked.Increment(ref _consecutivoNcf):D8}";

    public Task<Transaccion> CobrarAsync(TipoPago tipo, string referenciaId, string nombreContribuyente, decimal monto)
    {
        var sesion = _sesionService.SesionActual ?? throw new InvalidOperationException("No hay sesión abierta.");

        var transaccion = new Transaccion
        {
            IdSesion = sesion.IdSesion,
            Tipo = tipo,
            ReferenciaId = referenciaId,
            NombreContribuyente = nombreContribuyente,
            Monto = monto,
            NcfSimulado = GenerarNcfSimulado(),
            TimestampLocal = DateTimeOffset.Now,
        };

        sesion.Transacciones.Add(transaccion);
        return Task.FromResult(transaccion);
    }

    // Anulación SOLO local por ahora: marca la transacción como Anulada en la
    // sesión en memoria. La sincronización de anulaciones con Integración
    // no está en el contrato todavía (habría que agregar un
    // AnularPagoCommand y acordarlo con tu compañero) — cuando lo definan,
    // este es el método donde se dispararía ese mensaje.
    public void AnularTransaccion(Transaccion transaccion, string autorizadoPor, string motivo)
    {
        if (transaccion.Estado == EstadoPago.Anulado)
            throw new InvalidOperationException("Esta transacción ya está anulada.");

        transaccion.Estado = EstadoPago.Anulado;
    }
}