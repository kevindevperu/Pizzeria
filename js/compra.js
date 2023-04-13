const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');
const direccion = document.getElementById('direccion');
const NumeroTarjeta = document.getElementById('Numero');
const vigencia = document.getElementById('vigencia');
const cvv = document.getElementById('cvv')

cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}

function procesarCompra() {
    if (compra.obtenerProductosLocalStorage().length === 0) {
        alert("No hay Productos, Seleccionea alguno")
        window.location ="../Home/Index";
    } else if (cliente.value === '' || correo.value === '' || direccion.value === '' || NumeroTarjeta.value === '' || vigencia.value === '' || cvv.value === '') {
        alert("Falta llenar una o más casillas.Por favor, llene todos los campos requeridos")
    } else {
        alert("Pago realizado con exito, su producto llegara Pronto")
        compra.vaciarLocalStorage();
        window.location = "../Home/Index";
    }
}