namespace CajaADN.Contracts.Replies;

public class PagoRegistradoReply : NServiceBus.IMessage
{
    public Guid TransaccionId { get; set; }
    public bool Exito { get; set; }
    public int StatusCode { get; set; }
    public string? ErrorCode { get; set; }
    public string? Message { get; set; }
}