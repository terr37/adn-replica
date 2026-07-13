using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CajaADN.Integration.Migrations
{
    /// <inheritdoc />
    public partial class QuitarFondoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FondoInicial",
                table: "Sesiones");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "FondoInicial",
                table: "Sesiones",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
