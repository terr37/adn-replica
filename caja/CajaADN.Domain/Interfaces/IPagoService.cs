using CajaADN.Domain.Models;

namespace CajaADN.Domain.Interfaces;

public interface IPagoService
{
    Task<(bool Exito, string Mensaje)> IntentarSincronizarAsync(Transaccion transaccion);
}