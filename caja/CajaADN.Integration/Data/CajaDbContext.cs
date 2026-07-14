using CajaADN.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace CajaADN.Integration.Data;

public class UsuarioEntity
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string ClaveHash { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}

public class CajaDbContext : DbContext
{
    public DbSet<UsuarioEntity> Usuarios => Set<UsuarioEntity>();
    public DbSet<SesionCaja> Sesiones => Set<SesionCaja>();
    public DbSet<Transaccion> Transacciones => Set<Transaccion>();
    public DbSet<InmuebleCatastro> Catastro => Set<InmuebleCatastro>();

    public CajaDbContext(DbContextOptions<CajaDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UsuarioEntity>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.NombreUsuario).IsUnique();
        });

        modelBuilder.Entity<SesionCaja>(e =>
        {
            e.HasKey(x => x.IdSesion);
            e.Ignore(x => x.Transacciones);
        });

        modelBuilder.Entity<Transaccion>(e =>
        {
            e.HasKey(x => x.TransaccionId);
            e.Property(x => x.Tipo).HasConversion<string>();
            e.Property(x => x.Estado).HasConversion<string>();
            e.Property(x => x.MetodoPago).HasConversion<string>();   // ← nuevo
        });

        modelBuilder.Entity<InmuebleCatastro>(e => e.HasKey(x => x.InmuebleId));
    }
}