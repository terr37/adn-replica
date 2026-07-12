using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CajaADN.Integration.Sync;

public class SincronizacionOfflineService : BackgroundService
{
    private static readonly TimeSpan Intervalo = TimeSpan.FromSeconds(20);

    private readonly IDbContextFactory<CajaDbContext> _dbFactory;
    private readonly IPagoService _pagoService;
    private readonly ILogger<SincronizacionOfflineService> _logger;

    public SincronizacionOfflineService(
        IDbContextFactory<CajaDbContext> dbFactory, IPagoService pagoService,
        ILogger<SincronizacionOfflineService> logger)
    {
        _dbFactory = dbFactory;
        _pagoService = pagoService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await SincronizarPendientesAsync(stoppingToken);
            await Task.Delay(Intervalo, stoppingToken);
        }
    }

    private async Task SincronizarPendientesAsync(CancellationToken ct)
    {
        await using var db = await _dbFactory.CreateDbContextAsync(ct);
        var pendientes = (await db.Transacciones
      .Where(t => !t.Sincronizado && t.Estado == EstadoPago.Pagado)
      .ToListAsync(ct))
      .OrderBy(t => t.TimestampLocal)
      .ToList();
        if (pendientes.Count == 0) return;
        _logger.LogInformation("Sincronizando {N} transacción(es) pendientes...", pendientes.Count);

        foreach (var t in pendientes)
        {
            var (exito, mensaje) = await _pagoService.IntentarSincronizarAsync(t);
            t.IntentosSincronizacion++;
            t.UltimoIntentoSincronizacion = DateTime.Now;

            if (exito)
            {
                t.Sincronizado = true;
                _logger.LogInformation("Transacción {Id} sincronizada.", t.TransaccionId);
            }
            else
            {
                _logger.LogDebug("Transacción {Id} sigue pendiente: {Mensaje}", t.TransaccionId, mensaje);
                break;
            }
        }

        await db.SaveChangesAsync(ct);
    }
}