using CajaADN.Domain.Models;

namespace CajaADN.Domain.Interfaces;

public interface ICatastroService
{
    Task<IReadOnlyList<InmuebleCatastro>> ObtenerCatastroAsync();
    Task<InmuebleCatastro?> BuscarPorIdAsync(string inmuebleId);
}