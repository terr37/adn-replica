using CajaADN.Domain.Enums;

namespace CajaADN.Domain.Models;

public class Usuario
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public RolUsuario Rol { get; set; }
}