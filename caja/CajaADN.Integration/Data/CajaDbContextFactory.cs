using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CajaADN.Integration.Data;

// Esta clase SOLO la usa la herramienta de migraciones (Add-Migration) al diseñar;
// no tiene nada que ver con la conexión real que usa la app cuando corre.
public class CajaDbContextFactory : IDesignTimeDbContextFactory<CajaDbContext>
{
    public CajaDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CajaDbContext>();
        optionsBuilder.UseSqlite("Data Source=Caja.db");
        return new CajaDbContext(optionsBuilder.Options);
    }
}