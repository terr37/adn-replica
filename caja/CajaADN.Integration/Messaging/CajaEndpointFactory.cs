using NServiceBus;
using System.Reflection;

namespace CajaADN.Integration.Messaging;

public static class CajaEndpointFactory
{
    public const string EndpointName = "ADN.Caja";

    public static EndpointConfiguration Crear(string rabbitConnectionString, string nombreEndpointIntegracion)
    {
        var endpointConfiguration = new EndpointConfiguration(EndpointName);
        endpointConfiguration.UseSerialization<SystemJsonSerializer>();

        var transport = new RabbitMQTransport(
            RoutingTopology.Conventional(QueueType.Quorum),
            rabbitConnectionString);
        var routingSettings = endpointConfiguration.UseTransport(transport);

        // Llama a RouteToEndpoint directamente sobre el resultado de UseTransport
        routingSettings.RouteToEndpoint(
            assembly: typeof(Contracts.Commands.RegistrarPagoCommand).Assembly,
            destination: nombreEndpointIntegracion
        );
        
        endpointConfiguration.SendFailedMessagesTo("ADN.errors");
        endpointConfiguration.EnableInstallers();

        var recoverability = endpointConfiguration.Recoverability();
        recoverability.Immediate(i => i.NumberOfRetries(2));
        recoverability.Delayed(d => d.NumberOfRetries(3));

        return endpointConfiguration;
    }
}