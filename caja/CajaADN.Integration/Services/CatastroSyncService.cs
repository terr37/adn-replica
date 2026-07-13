using System.Net.Http.Json;
using CajaADN.Domain.Models;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace CajaADN.Integration.Services;

public class CatastroSyncService : BackgroundService
{
    private readonly IDbContextFactory<CajaDbContext> _dbFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<CatastroSyncService> _logger;
    private static readonly TimeSpan Intervalo = TimeSpan.FromMinutes(5);

    public CatastroSyncService(IDbContextFactory<CajaDbContext> dbFactory, IConfiguration config, ILogger<CatastroSyncService> logger)
    {
        _dbFactory = dbFactory;
        _config = config;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await SincronizarAsync();
            await Task.Delay(Intervalo, stoppingToken);
        }
    }

    private async Task SincronizarAsync()
    {
        try
        {
            var baseUrl = _config["Core:ApiBaseUrl"] ?? "http://localhost:3000/api";
            using var http = new HttpClient();
            var inmueblesCore = await http.GetFromJsonAsync<List<InmuebleCoreDto>>($"{baseUrl}/aseo/inmuebles");
            if (inmueblesCore is null) return;

            await using var db = await _dbFactory.CreateDbContextAsync();
            foreach (var i in inmueblesCore)
            {
                var existente = await db.Catastro.FindAsync(i.Id);
                if (existente is null)
                {
                    db.Catastro.Add(new InmuebleCatastro
                    {
                        InmuebleId = i.Id,               // ← UUID real de Core
                        Direccion = i.Direccion,
                        Zona = i.Zona,
                        TipoUso = i.TipoUso == "COMERCIAL" ? "Comercial" : "Residencial",
                    });
                }
                else
                {
                    existente.Direccion = i.Direccion;
                    existente.Zona = i.Zona;
                    existente.TipoUso = i.TipoUso == "COMERCIAL" ? "Comercial" : "Residencial";
                }
            }
            await db.SaveChangesAsync();
            _logger.LogInformation("Catastro sincronizado: {N} inmuebles.", inmueblesCore.Count);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("No se pudo sincronizar catastro con Core: {Msg}", ex.Message);
        }
    }

    private class InmuebleCoreDto
    {
        public string Id { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Zona { get; set; } = string.Empty;
        public string TipoUso { get; set; } = string.Empty;
    }
}