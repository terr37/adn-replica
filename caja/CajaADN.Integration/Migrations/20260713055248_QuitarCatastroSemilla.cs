using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CajaADN.Integration.Migrations
{
    /// <inheritdoc />
    public partial class QuitarCatastroSemilla : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Catastro",
                keyColumn: "InmuebleId",
                keyValue: "INM-00101");

            migrationBuilder.DeleteData(
                table: "Catastro",
                keyColumn: "InmuebleId",
                keyValue: "INM-00102");

            migrationBuilder.DeleteData(
                table: "Catastro",
                keyColumn: "InmuebleId",
                keyValue: "INM-00201");

            migrationBuilder.DeleteData(
                table: "Catastro",
                keyColumn: "InmuebleId",
                keyValue: "INM-00202");

            migrationBuilder.DeleteData(
                table: "Catastro",
                keyColumn: "InmuebleId",
                keyValue: "INM-00301");

            migrationBuilder.DeleteData(
                table: "Catastro",
                keyColumn: "InmuebleId",
                keyValue: "INM-00302");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
