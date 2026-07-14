using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CajaADN.Integration.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCedulaCliente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cedula",
                table: "Transacciones",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "EfectivoInicial",
                table: "Sesiones",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cedula",
                table: "Transacciones");

            migrationBuilder.DropColumn(
                name: "EfectivoInicial",
                table: "Sesiones");
        }
    }
}
