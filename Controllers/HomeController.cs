using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using PRUEBAS_LOGIN.Permisos;

namespace PRUEBAS_LOGIN.Controllers
{

    [ValidarSesion]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult CerrarSesion()
        {
            Session["usuario"] = null;
            return RedirectToAction("Login", "Acceso");
        }

        //public ActionResult Menu()
        //{
        //    return View(); 
        //}

        //public ActionResult Pagos()
        //{
        //    return View();
        //}

        public ActionResult compra()
        {
            return View();
        }


    }
}