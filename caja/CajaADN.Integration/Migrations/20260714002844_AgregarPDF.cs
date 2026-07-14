using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CajaADN.Integration.Migrations
{
    /// <inheritdoc />
    public partial class AgregarPDF : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetodoPago",
                table: "Transacciones",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MetodoPago",
                table: "Transacciones");
        }
    }
}
