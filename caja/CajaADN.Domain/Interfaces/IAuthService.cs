using CajaADN.Domain.Enums;

namespace CajaADN.Domain.Interfaces;

public interface IAuthService
{
    Task<(bool Exito, string? NombreUsuario, RolUsuario? Rol)> LoginAsync(string usuario, string clave);
}