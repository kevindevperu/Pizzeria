function registrarUsuario() {
    // Obtener los valores de los campos del formulario
    var correo = document.getElementById("Correo").value;
    var clave = document.getElementById("Clave").value;
    var confirmarClave = document.getElementById("ConfirmarClave").value;
  
    // Comprobar que las contraseñas coinciden
    if (clave !== confirmarClave) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    // Generar un salt aleatorio
    var salt = generarSalt();
  
    // Convertir la contraseña y el salt en hash SHA256
    var claveHash = convertirSha256(clave, salt);
  
    // Crear un objeto de datos para enviar al servidor
    var datos = {
      Correo: correo,
      Clave: claveHash,
      Salt: salt,
    };
  
    // Crear una solicitud HTTP POST con los datos del usuario a registrar
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Acceso/Registrar", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Procesar la respuesta del servidor
        var respuesta = JSON.parse(xhr.responseText);
        if (respuesta.Registrado) {
          alert("Usuario registrado exitosamente");
          window.location.href = "/Acceso/Login";
        } else {
          alert(respuesta.Mensaje);
        }
      }
    };
    xhr.send(JSON.stringify(datos));
  }