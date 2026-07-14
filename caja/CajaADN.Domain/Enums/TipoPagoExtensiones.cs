namespace CajaADN.Domain.Enums;

public static class TipoPagoExtensiones
{
    public static string NombreVisible(this TipoPago tipo) => tipo switch
    {
        TipoPago.PAGO_ASEO_URBANO => "Aseo Urbano (Recogida Regular)",
        TipoPago.PAGO_PERMISO_CONSTRUCCION => "Permiso de Construcción",
        TipoPago.PAGO_CEMENTERIO => "Cementerio (Venta de Fosa)",
        TipoPago.PAGO_RECOLECCION_ESPECIAL => "Recolección Especial",
        TipoPago.PAGO_USO_ESPACIO_PUBLICO => "Uso de Espacio Público",
        TipoPago.PAGO_REGISTRO_COMERCIAL => "Registro Comercial",
        TipoPago.PAGO_CERTIFICACION_NO_OBJECCION => "Certificación de No Objeción",
        TipoPago.PAGO_SOLICITUD_PODA => "Solicitud de Poda",
        TipoPago.PAGO_PLACA_NUMERACION => "Placa de Numeración",
        TipoPago.PAGO_PUBLICIDAD_EXTERIOR => "Publicidad Exterior",
        _ => tipo.ToString(),
    };
}