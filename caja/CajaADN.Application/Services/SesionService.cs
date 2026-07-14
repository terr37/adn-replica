using CajaADN.Domain.Enums;
using CajaADN.Domain.Models;

namespace CajaADN.Application.Services;

public class SesionService
{
    public SesionCaja? SesionActual { get; private set; }
    public bool HaySesionAbierta => SesionActual?.Estado == EstadoSesion.Abierta;

    public SesionCaja AbrirSesion(string usuario, decimal efectivoInicial)
    {
        if (HaySesionAbierta) throw new InvalidOperationException("Ya hay una sesión abierta.");
        SesionActual = new SesionCaja { UsuarioCajero = usuario, EfectivoInicial = efectivoInicial };
        return SesionActual;
    }

    public void CerrarSesion()
    {
        if (SesionActual is null) throw new InvalidOperationException("No hay sesión abierta.");
        SesionActual.Estado = EstadoSesion.Cerrada;
        SesionActual.FechaCierre = DateTime.Now;
    }
}