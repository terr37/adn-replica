using CajaADN.Domain.Enums;

namespace CajaADN.Domain.Models;

public class SesionCaja
{
    public Guid IdSesion { get; set; } = Guid.NewGuid();
    public string UsuarioCajero { get; set; } = string.Empty;
    public DateTime FechaApertura { get; set; } = DateTime.Now;
    public DateTime? FechaCierre { get; set; }
    public EstadoSesion Estado { get; set; } = EstadoSesion.Abierta;
    public List<Transaccion> Transacciones { get; set; } = [];
}