using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CajaADN.Integration.Migrations
{
    /// <inheritdoc />
    public partial class InicialSqlite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Catastro",
                columns: table => new
                {
                    InmuebleId = table.Column<string>(type: "TEXT", nullable: false),
                    Direccion = table.Column<string>(type: "TEXT", nullable: false),
                    Zona = table.Column<string>(type: "TEXT", nullable: false),
                    TipoUso = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Catastro", x => x.InmuebleId);
                });

            migrationBuilder.CreateTable(
                name: "Sesiones",
                columns: table => new
                {
                    IdSesion = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioCajero = table.Column<string>(type: "TEXT", nullable: false),
                    FondoInicial = table.Column<decimal>(type: "TEXT", nullable: false),
                    FechaApertura = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaCierre = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Estado = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sesiones", x => x.IdSesion);
                });

            migrationBuilder.CreateTable(
                name: "Transacciones",
                columns: table => new
                {
                    TransaccionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IdSesion = table.Column<Guid>(type: "TEXT", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: false),
                    ReferenciaId = table.Column<string>(type: "TEXT", nullable: false),
                    NombreContribuyente = table.Column<string>(type: "TEXT", nullable: false),
                    Monto = table.Column<decimal>(type: "TEXT", nullable: false),
                    Moneda = table.Column<string>(type: "TEXT", nullable: false),
                    NcfSimulado = table.Column<string>(type: "TEXT", nullable: false),
                    Origen = table.Column<string>(type: "TEXT", nullable: false),
                    TimestampLocal = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    Estado = table.Column<string>(type: "TEXT", nullable: false),
                    Sincronizado = table.Column<bool>(type: "INTEGER", nullable: false),
                    IntentosSincronizacion = table.Column<int>(type: "INTEGER", nullable: false),
                    UltimoIntentoSincronizacion = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacciones", x => x.TransaccionId);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NombreUsuario = table.Column<string>(type: "TEXT", nullable: false),
                    ClaveHash = table.Column<string>(type: "TEXT", nullable: false),
                    Rol = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Catastro",
                columns: new[] { "InmuebleId", "Direccion", "TipoUso", "Zona" },
                values: new object[,]
                {
                    { "INM-00101", "Av. Winston Churchill", "Residencial", "Piantini" },
                    { "INM-00102", "Av. Abraham Lincoln", "Comercial", "Piantini" },
                    { "INM-00201", "Calle Pasteur", "Residencial", "Gazcue" },
                    { "INM-00202", "Av. Independencia", "Comercial", "Gazcue" },
                    { "INM-00301", "Calle El Conde", "Comercial", "Zona Colonial" },
                    { "INM-00302", "Calle Las Damas", "Residencial", "Zona Colonial" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_NombreUsuario",
                table: "Usuarios",
                column: "NombreUsuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Catastro");

            migrationBuilder.DropTable(
                name: "Sesiones");

            migrationBuilder.DropTable(
                name: "Transacciones");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
