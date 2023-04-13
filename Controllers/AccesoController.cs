using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

using PRUEBAS_LOGIN.Models;

using System.Data.SqlClient;
using System.Data;
using PRUEBAS_LOGIN.Utils;

namespace PRUEBAS_LOGIN.Controllers
{
    public class AccesoController : Controller
    {

        static string cadena = "Data Source=DESKTOP-9B4FHOH\\SQLEXPRESS;Initial Catalog=DB_ACCESO;Trusted_Connection=False; User ID=sa;Password=123456";



        // GET: Acceso
        public ActionResult Login()
        {
            return View();
        }


        public ActionResult Registrar()
        {
            return View();
        }


        [HttpPost]
        public ActionResult Registrar(Usuario oUsuario)
        {
            bool registrado;
            string mensaje;
            Security _security = new Security();

            if (oUsuario.Clave == oUsuario.ConfirmarClave)
            {

                string salt = _security.GenerateSalt(); // Generar un salt aleatorio
                oUsuario.Clave = _security.ConverToSha256(oUsuario.Clave, salt); // Agregar el salt a la contraseña y generar el hash SHA256

                using (SqlConnection cn = new SqlConnection(cadena))
                {

                    SqlCommand cmd = new SqlCommand("sp_RegistrarUsuario", cn);
                    cmd.Parameters.AddWithValue("Correo", oUsuario.Correo);
                    cmd.Parameters.AddWithValue("Clave", oUsuario.Clave);
                    cmd.Parameters.AddWithValue("Salt", salt); // Guardar el salt en la base de datos
                    cmd.Parameters.Add("Registrado", SqlDbType.Bit).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("Mensaje", SqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.CommandType = CommandType.StoredProcedure;

                    cn.Open();

                    cmd.ExecuteNonQuery();

                    registrado = Convert.ToBoolean(cmd.Parameters["Registrado"].Value);
                    mensaje = cmd.Parameters["Mensaje"].Value.ToString();


                }

                ViewData["Mensaje"] = mensaje;

                if (registrado)
                {
                    return RedirectToAction("Login", "Acceso");
                }
                else
                {
                    return View();
                }

            }
            else
            {
                ViewData["Mensaje"] = "Las contraseñas no coinciden";
                return View();
            }

        }

        [HttpPost]
        public ActionResult Login(Usuario oUsuario)
        {
            Security _security = new Security();
            using (SqlConnection cn = new SqlConnection(cadena))
            {
                cn.Open();

                // Obtener el salt de la base de datos correspondiente al correo electrónico del usuario
                SqlCommand saltCmd = new SqlCommand("SELECT Salt FROM Usuario WHERE Correo = @Correo", cn);
                saltCmd.Parameters.AddWithValue("Correo", oUsuario.Correo);
                string salt = saltCmd.ExecuteScalar().ToString();

                // Generar el hash SHA256 de la contraseña del usuario junto con el salt recuperado
                oUsuario.Clave = _security.ConverToSha256(oUsuario.Clave, salt);

                // Validar las credenciales del usuario
                SqlCommand cmd = new SqlCommand("sp_ValidarUsuario", cn);
                cmd.Parameters.AddWithValue("Correo", oUsuario.Correo);
                cmd.Parameters.AddWithValue("Clave", oUsuario.Clave);
                cmd.CommandType = CommandType.StoredProcedure;

                oUsuario.IdUsuario = Convert.ToInt32(cmd.ExecuteScalar().ToString());

            }

            if (oUsuario.IdUsuario != 0)
            {

                Session["usuario"] = oUsuario;
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ViewData["Mensaje"] = "usuario no encontrado";
                return View();
            }



        }

        // Generar un salt aleatorio utilizando la clase RNGCryptoServiceProvider


    }
}