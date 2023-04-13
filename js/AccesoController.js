// Generar un salt aleatorio utilizando la clase Crypto.getRandomValues()
function generarSalt() {
    var randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return btoa(String.fromCharCode.apply(null, randomBytes));
  }
  
  // Convertir una cadena a hash SHA256
  function convertirSha256(cadena, salt) {
    var encoder = new TextEncoder();
    var data = encoder.encode(cadena + salt);
    return crypto.subtle.digest("SHA-256", data)
      .then(function (hashBytes) {
        var hashArray = Array.from(new Uint8Array(hashBytes));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
  }
  
  // GET: Acceso
  function login() {
    // Renderizar la vista correspondiente
  }
  
  function registrar() {
    // Renderizar la vista correspondiente
  }
  
  // Registrar un usuario en la base de datos
  function registrarUsuario(oUsuario) {
    var registrado;
    var mensaje;
  
    if (oUsuario.Clave == oUsuario.ConfirmarClave) {
      var salt = generarSalt(); // Generar un salt aleatorio
      convertirSha256(oUsuario.Clave, salt).then(function (hash) {
        oUsuario.Clave = hash;
  
        // Guardar el usuario en la base de datos
        var params = new URLSearchParams();
        params.append('Correo', oUsuario.Correo);
        params.append('Clave', oUsuario.Clave);
        params.append('Salt', salt);
        fetch('/api/registrarUsuario', {
          method: 'POST',
          body: params
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          registrado = data.registrado;
          mensaje = data.mensaje;
          document.getElementById("mensaje").innerText = mensaje;
          if (registrado) {
            window.location.href = "/Acceso/Login";
          }
        });
      });
    } else {
      mensaje = "Las contraseñas no coinciden";
      document.getElementById("mensaje").innerText = mensaje;
    }
  }
  
  // Validar las credenciales de un usuario en la base de datos
  function validarUsuario(oUsuario) {
    convertirSha256(oUsuario.Clave, oUsuario.Salt).then(function (hash) {
      oUsuario.Clave = hash;
  
      // Validar las credenciales del usuario
      var params = new URLSearchParams();
      params.append('Correo', oUsuario.Correo);
      params.append('Clave', oUsuario.Clave);
      fetch('/api/validarUsuario', {
        method: 'POST',
        body: params
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var idUsuario = data.idUsuario;
        if (idUsuario != 0) {
          oUsuario.IdUsuario = idUsuario;
          sessionStorage.setItem("usuario", JSON.stringify(oUsuario));
          window.location.href = "/Home/Index";
        } else {
          document.getElementById("mensaje").innerText = "usuario no encontrado";
        }
      });
    });
  }