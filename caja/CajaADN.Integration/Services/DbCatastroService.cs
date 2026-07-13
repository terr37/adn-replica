using CajaADN.Domain.Interfaces;
using CajaADN.Domain.Models;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.Integration.Services;

public class DbCatastroService : ICatastroService
{
    private readonly IDbContextFactory<CajaDbContext> _factory;
    public DbCatastroService(IDbContextFactory<CajaDbContext> factory) => _factory = factory;

    public async Task<IReadOnlyList<InmuebleCatastro>> ObtenerCatastroAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Catastro.AsNoTracking().ToListAsync();
    }

    public async Task<InmuebleCatastro?> BuscarPorIdAsync(string inmuebleId)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Catastro.FindAsync(inmuebleId);
    }
}