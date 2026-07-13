namespace CajaADN.UI;

public static class UiTheme
{
    public static readonly Color AzulADN = Color.FromArgb(5, 20, 41);
    public static readonly Color DoradoADN = Color.FromArgb(233, 217, 174);
    public static readonly Color FondoClaro = Color.FromArgb(245, 246, 248);
    public static readonly Color Exito = Color.FromArgb(34, 139, 34);
    public static readonly Color Peligro = Color.Firebrick;

    public static Panel CrearHeader(string subtitulo)
    {
        var panel = new Panel { Dock = DockStyle.Top, Height = 64, BackColor = AzulADN };

        var lblTitulo = new Label
        {
            Text = "Alcaldía del Distrito Nacional",
            ForeColor = DoradoADN,
            Font = new Font("Segoe UI", 13, FontStyle.Bold),
            AutoSize = true,
            Location = new Point(16, 8),
        };
        var lblSub = new Label
        {
            Text = subtitulo,
            ForeColor = Color.White,
            Font = new Font("Segoe UI", 9),
            AutoSize = true,
            Location = new Point(16, 34),
        };

        panel.Controls.Add(lblTitulo);
        panel.Controls.Add(lblSub);
        return panel;
    }

    public static Button BotonPrimario(string texto) => new()
    {
        Text = texto,
        Height = 42,
        BackColor = AzulADN,
        ForeColor = DoradoADN,
        FlatStyle = FlatStyle.Flat,
        Font = new Font("Segoe UI", 10, FontStyle.Bold),
        FlatAppearance = { BorderSize = 0 },
        Cursor = Cursors.Hand,
    };

    public static Button BotonMenu(string texto) => new()
    {
        Text = texto,
        Width = 380,
        Height = 60,
        Font = new Font("Segoe UI", 12),
        Margin = new Padding(0, 0, 0, 16),
        TextAlign = ContentAlignment.MiddleLeft,
        FlatStyle = FlatStyle.Flat,
        BackColor = Color.White,
        FlatAppearance = { BorderColor = AzulADN, BorderSize = 1 },
        Cursor = Cursors.Hand,
    };
}