using System.Security.Cryptography;

namespace CajaADN.Integration.Data;

public class ClaveHasher
{
    private const int SaltSize = 16, HashSize = 32, Iterations = 100_000;

    public string Hash(string clave)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(clave, salt, Iterations, HashAlgorithmName.SHA256, HashSize);
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verificar(string clave, string hashAlmacenado)
    {
        var partes = hashAlmacenado.Split('.');
        if (partes.Length != 2) return false;
        var salt = Convert.FromBase64String(partes[0]);
        var hashGuardado = Convert.FromBase64String(partes[1]);
        var hashCalculado = Rfc2898DeriveBytes.Pbkdf2(clave, salt, Iterations, HashAlgorithmName.SHA256, HashSize);
        return CryptographicOperations.FixedTimeEquals(hashGuardado, hashCalculado);
    }
}