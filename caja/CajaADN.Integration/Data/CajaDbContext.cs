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
        });

        modelBuilder.Entity<InmuebleCatastro>(e => e.HasKey(x => x.InmuebleId));

        modelBuilder.Entity<InmuebleCatastro>().HasData(
            new InmuebleCatastro { InmuebleId = "INM-00101", Direccion = "Av. Winston Churchill", Zona = "Piantini", TipoUso = "Residencial" },
            new InmuebleCatastro { InmuebleId = "INM-00102", Direccion = "Av. Abraham Lincoln", Zona = "Piantini", TipoUso = "Comercial" },
            new InmuebleCatastro { InmuebleId = "INM-00201", Direccion = "Calle Pasteur", Zona = "Gazcue", TipoUso = "Residencial" },
            new InmuebleCatastro { InmuebleId = "INM-00202", Direccion = "Av. Independencia", Zona = "Gazcue", TipoUso = "Comercial" },
            new InmuebleCatastro { InmuebleId = "INM-00301", Direccion = "Calle El Conde", Zona = "Zona Colonial", TipoUso = "Comercial" },
            new InmuebleCatastro { InmuebleId = "INM-00302", Direccion = "Calle Las Damas", Zona = "Zona Colonial", TipoUso = "Residencial" }
        );
    }
}