namespace CajaADN.Domain.Models;

public class InmuebleCatastro
{
    public string InmuebleId { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Zona { get; set; } = string.Empty;
    public string TipoUso { get; set; } = "Residencial";
    public decimal TarifaMensual => TipoUso == "Comercial" ? 1500m : 300m;
}