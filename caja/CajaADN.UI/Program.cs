using CajaADN.Application.Services;
using CajaADN.Domain.Interfaces;
using CajaADN.Integration.Data;
using CajaADN.Integration.Messaging;
using CajaADN.Integration.Services;
using CajaADN.Integration.Sync;
using CajaADN.UI.Forms;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CajaADN.UI;

internal static class Program
{
    private static IHost _host = null!;
    public static IServiceProvider ServiceProvider => _host.Services;

    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();

        Directory.CreateDirectory(Path.Combine(AppContext.BaseDirectory, "Data"));

        var builder = Host.CreateApplicationBuilder();
        builder.Configuration.SetBasePath(AppContext.BaseDirectory).AddJsonFile("appsettings.json", optional: false);

        ConfigurarServicios(builder.Services, builder.Configuration);

        var endpointConfiguration = CajaEndpointFactory.Crear(
            builder.Configuration["RabbitMQ:ConnectionString"]!,
            builder.Configuration["Integracion:NombreEndpoint"]!);
        builder.UseNServiceBus(endpointConfiguration);

        _host = builder.Build();

        try
        {
            _host.Start();
        }
        catch (Exception ex)
        {
            MessageBox.Show($"No se pudo iniciar el bus de mensajería (RabbitMQ).\n\n{ex.Message}\n\n" +
                "La Caja puede seguir cobrando en modo offline.",
                "Aviso", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }

        AplicarMigracionesYSemilla();

        using var frmLogin = new FrmLogin(ServiceProvider.GetRequiredService<IAuthService>());
        if (frmLogin.ShowDialog() == DialogResult.OK)
        {
            using var frmApertura = new FrmAperturaSesion(frmLogin.Usuario!);
            if (frmApertura.ShowDialog() == DialogResult.OK)
            {
                ServiceProvider.GetRequiredService<SesionService>()
                    .AbrirSesion(frmLogin.Usuario!);

                using var frmPrincipal = new FrmPrincipal(
                    ServiceProvider.GetRequiredService<SesionService>(),
                    ServiceProvider.GetRequiredService<CobroService>(),
                    ServiceProvider.GetRequiredService<IAuthService>(),
                    ServiceProvider.GetRequiredService<IDbContextFactory<CajaDbContext>>());
                System.Windows.Forms.Application.Run(frmPrincipal);
            }
        }

        _host.StopAsync().GetAwaiter().GetResult();
    }

    private static void ConfigurarServicios(IServiceCollection services, IConfiguration config)
    {
        var dbPath = Path.Combine(AppContext.BaseDirectory, config.GetConnectionString("CajaLocalDb")!);
        services.AddDbContextFactory<CajaDbContext>(o => o.UseSqlite($"Data Source={dbPath}"));

        services.AddSingleton<PendingRequestCorrelator>();
        services.AddSingleton<IAuthService, DbAuthService>();
        services.AddSingleton<ICatastroService, DbCatastroService>();
        services.AddSingleton<IPagoService, NsbPagoService>();
        services.AddSingleton<SesionService>();
        services.AddTransient<CobroService>();
        services.AddHostedService<SincronizacionOfflineService>();
    }

    private static void AplicarMigracionesYSemilla()
    {
        using var scope = ServiceProvider.CreateScope();
        var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<CajaDbContext>>();
        using var db = factory.CreateDbContext();
        db.Database.Migrate();

        if (!db.Usuarios.Any())
        {
            var hasher = new ClaveHasher();
            db.Usuarios.AddRange(
                new UsuarioEntity { NombreUsuario = "cajero1", ClaveHash = hasher.Hash("cajero1"), Rol = "Cajero" },
                new UsuarioEntity { NombreUsuario = "supervisor1", ClaveHash = hasher.Hash("supervisor1"), Rol = "Supervisor" });
            db.SaveChanges();
        }
    }
}