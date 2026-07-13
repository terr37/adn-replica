using CajaADN.Domain.Enums;
using CajaADN.Domain.Interfaces;
using CajaADN.Integration.Data;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.Integration.Services;

public class DbAuthService : IAuthService
{
    private readonly IDbContextFactory<CajaDbContext> _factory;
    private readonly ClaveHasher _hasher = new();

    public DbAuthService(IDbContextFactory<CajaDbContext> factory) => _factory = factory;

    public async Task<(bool, string?, RolUsuario?)> LoginAsync(string usuario, string clave)
    {
        await using var db = await _factory.CreateDbContextAsync();
        var user = await db.Usuarios.FirstOrDefaultAsync(u => u.NombreUsuario == usuario);
        if (user is null || !_hasher.Verificar(clave, user.ClaveHash)) return (false, null, null);
        return (true, user.NombreUsuario, Enum.Parse<RolUsuario>(user.Rol));
    }
}