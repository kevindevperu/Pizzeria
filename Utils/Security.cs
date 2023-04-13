using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace PRUEBAS_LOGIN.Utils
{
    public class Security
    {

        public string GenerateSalt()
        {
            byte[] randomBytes = new byte[32];
            using (RNGCryptoServiceProvider rngCsp = new RNGCryptoServiceProvider())
            {
                rngCsp.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

        // Convertir una cadena a hash SHA256
        public string ConverToSha256(string cadena, string salt)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(cadena + salt);

            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] hashBytes = sha256Hash.ComputeHash(bytes);
                StringBuilder hashBuilder = new StringBuilder();

                for (int i = 0; i < hashBytes.Length; i++)
                {
                    hashBuilder.Append(hashBytes[i].ToString("x2"));
                }

                return hashBuilder.ToString();
            }
        }

    }
}