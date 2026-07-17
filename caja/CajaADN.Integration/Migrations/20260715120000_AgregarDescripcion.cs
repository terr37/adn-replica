using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CajaADN.Integration.Migrations
{
    /// <inheritdoc />
    public partial class AgregarDescripcion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Transacciones",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Transacciones");
        }
    }
}
