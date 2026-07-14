using System.Drawing;
using System.Windows.Forms;

namespace CajaADN.UI;

public static class UiTheme
{
    // Paleta de colores refinada (Bordes más sutiles y mejor contraste)
    public static readonly Color AzulADN = Color.FromArgb(5, 20, 41);
    public static readonly Color DoradoADN = Color.FromArgb(212, 175, 55); // Un dorado más vivo y elegante
    public static readonly Color FondoClaro = Color.FromArgb(240, 242, 245); // Gris claro moderno tipo web
    public static readonly Color GrisBorde = Color.FromArgb(218, 222, 229); // Para separar sin saturar
    public static readonly Color Exito = Color.FromArgb(40, 167, 69);
    public static readonly Color Peligro = Color.FromArgb(220, 53, 69);

    public static Panel CrearHeader(string subtitulo)
    {
        var panel = new Panel
        {
            Dock = DockStyle.Top,
            Height = 70, // Un poco más alto para dar aire
            BackColor = AzulADN
        };

        // Línea decorativa dorada inferior en el header para identidad institucional
        var lineaDorada = new Panel
        {
            Dock = DockStyle.Bottom,
            Height = 3,
            BackColor = DoradoADN
        };
        panel.Controls.Add(lineaDorada);

        var lblTitulo = new Label
        {
            Text = "Alcaldía del Distrito Nacional",
            ForeColor = Color.White, // Blanco lee mejor aquí, el dorado destaca más abajo o en detalles
            Font = new Font("Segoe UI Semibold", 14, FontStyle.Bold),
            AutoSize = true,
            Location = new Point(24, 12),
        };

        var lblSub = new Label
        {
            Text = subtitulo.ToUpper(), // En mayúsculas estilo tag informativo
            ForeColor = DoradoADN, // El subtítulo resalta con la identidad institucional
            Font = new Font("Segoe UI", 9, FontStyle.Bold),
            AutoSize = true,
            Location = new Point(24, 38),
        };

        panel.Controls.Add(lblTitulo);
        panel.Controls.Add(lblSub);
        return panel;
    }

    public static Button BotonPrimario(string texto) => new()
    {
        Text = texto,
        Height = 45,
        BackColor = AzulADN,
        ForeColor = Color.White,
        FlatStyle = FlatStyle.Flat,
        Font = new Font("Segoe UI Semibold", 10, FontStyle.Bold),
        FlatAppearance =
        {
            BorderSize = 0,
            MouseOverBackColor = Color.FromArgb(12, 38, 74) // Feedback visual al pasar el mouse
        },
        Cursor = Cursors.Hand,
    };

    public static Button BotonMenu(string texto)
    {
        var btn = new Button
        {
            Text = "   " + texto, // Un pequeño espacio inicial para que el texto respire
            Width = 400, // Ligeramente más ancho para pantallas modernas
            Height = 64,  // Más alto para que parezca una tarjeta (card) táctil
            Font = new Font("Segoe UI Semibold", 11, FontStyle.Bold),
            ForeColor = AzulADN,
            Margin = new Padding(0, 0, 0, 16),
            TextAlign = ContentAlignment.MiddleLeft,
            FlatStyle = FlatStyle.Flat,
            BackColor = Color.White,
            Cursor = Cursors.Hand
        };

        // Bordes limpios sin saturar de azul fuerte
        btn.FlatAppearance.BorderColor = GrisBorde;
        btn.FlatAppearance.BorderSize = 1;

        // Efecto Hover: Cuando pasas el mouse se pinta sutilmente del azul de la alcaldía
        btn.FlatAppearance.MouseOverBackColor = Color.FromArgb(240, 244, 250);
        btn.MouseEnter += (s, e) => btn.FlatAppearance.BorderColor = AzulADN;
        btn.MouseLeave += (s, e) => btn.FlatAppearance.BorderColor = GrisBorde;

        return btn;
    }
}