class Perfil {
  constructor(nombreU, correoU, passwordU) {
    this.nombre = nombreU;
    this.email = correoU;
    this.password = passwordU;
  }
}

let perfiles = [];

/* estilos de ingreso y registro */

document
  .querySelector("#registrobtn")
  .addEventListener("click", estiloRegistro);

let registroStyle = document.querySelector("#divisionRegistro");
let importadorStyle = document.querySelector("#divisionIngresoImp");

let registro = false;
let ingreso = false;

function estiloRegistro() {
  registro = true;
  ingreso = false;
  registroStyle.style.display = "flex";
  importadorStyle.style.display = "none";

  /* si el boton registro se encuentra activo */

  if (registro) {
    function registroImportador() {
      let nombreUsuario = document.querySelector("#nombreUsuario").value;
      let correoTomado = document.querySelector("#correo").value;
      let correo = correoTomado.toLowerCase();
      let contrasenia = document.querySelector("#password").value;
      let contrasenia2 = document.querySelector("#password2").value;

      /* validacion de correo electronico */

      let funcionValidarCorreo = correoValidation(correo);
      console.log(funcionValidarCorreo);

      /* validacion de contraseña camelCase y verificacion de contraseña*/
      let contraseniaIgual = false;
      let contraseniaCamelCaseTrue = contraseniaCamelCase(contrasenia);
      if (contraseniaCamelCaseTrue) {
        if (contrasenia2 !== contrasenia) {
          alert("Las contraseñas deben ser iguales");
        } else {
          contraseniaIgual = true;
        }
      }

      /* validacion de nombre usuario y correo existentes*/
      let apareceNombre = buscarElemento(perfiles, "nombre", nombreUsuario);
      let apareceCorreo = buscarElemento(perfiles, "email", correo);

      if (!apareceNombre && funcionValidarCorreo && !apareceCorreo) {
        let perfil = new Perfil(nombreUsuario, correo, contrasenia);
        perfiles.push(perfil);
      } else if (apareceNombre || apareceCorreo) {
        alert("El nombre de usuario o el correo ya son existentes");
      }
      console.log(perfiles);
    }

    /* buscar elemento en el array */
    function buscarElemento(elementosDelArray, propiedad, busqueda) {
      for (let i = 0; i < elementosDelArray.length; i++) {
        const elemento = elementosDelArray[i];
        if (elemento[propiedad] === busqueda) {
          return true;
        } else {
          return false;
        }
      }
    }

    /* contraseña camelcase mas numero */
    function contraseniaCamelCase(contra) {
      let mayus = false;
      let min = false;
      let numero = false;

      let contraseniaMin = contra.toLowerCase();
      let contraseniaMayus = contra.toUpperCase();

      for (let i = 0; i < contra.length; i++) {
        if (contra[i] !== contraseniaMin[i]) {
          mayus = true;
        }
        if (contra[i] !== contraseniaMayus[i]) {
          min = true;
        }
        if (!isNaN(contra[i])) {
          numero = true;
        }
      }

      if (mayus === true && min === true && numero === true) {
        return true;
      } else {
        alert("La contraseña debe tener mayusculas, minusculas y un numero");
      }
    }

    function correoValidation(correoElectronicoValidado) {
      /* VARIABLES DE DEVISION */
      let usuario;
      let servidor;
      let servidorDominio;
      let dominio;
      let dominioValido = false;
      let arroba;
      let arrobaValido = false;

      /* validaciond e arroba, si tiene dos no avanza */

      for (let i = 0; i < correoElectronicoValidado.length; i++) {
        if (correoElectronicoValidado[i] === "@") {
          arroba = correoElectronicoValidado[i];
          servidor = correoElectronicoValidado.substring(
            i + 1,
            correoElectronicoValidado.indexOf(".")
          );
          servidorDominio = correoElectronicoValidado.substring(i + 1);
          usuario = correoElectronicoValidado.substring(0, i);
          break;
        }
      }
      for (let j = 0; j < servidorDominio.length; j++) {
        if (arroba === servidorDominio[j]) {
          alert("No puedes tener dos arrobas");
          servidorDominio = "";
        } else arrobaValido = true;
      }
      /* termina validacio de arroba */

      /* ------------------------------ */

      /* validacion de servidor y dominio.length */
      /* no puedenhaber dos puntos seguidos */

      if (servidorDominio.length >= 4 && servidorDominio.length <= 255) {
        let servidorDominioLength = true;
        let puntuacionValida = true;

        if (servidorDominioLength)
          for (let k = 0; k < servidorDominio.length; k++) {
            if (servidorDominio[k] === ".") {
              let punto = servidorDominio[k];
              if (punto === servidorDominio[k + 1]) {
                alert("No puedes tener dos puntos seguidos");
                puntuacionValida = false;
              }
              /* si no hay dos puntos seguidos debemos validar el dominio */
              if (puntuacionValida) {
                dominio = servidorDominio.substring(
                  servidorDominio.indexOf(".") + 1
                );
                if (dominio.length >= 2) dominioValido = true;
              } else {
                dominioValido = false;
                break;
              }
            }
          }
      } else {
        alert("El correo es inexistente, comprueba el tamaño del dominio");
      }

      /* variable de validacion usuario */

      let usuarioValido;

      if (usuario.length > 1 && usuario.length < 64) {
        for (let i = 0; i < usuario.length; i++) {
          let ascci = usuario.charCodeAt(i);
          if (
            (ascci >= 97 && ascci <= 122) ||
            ascci === 45 ||
            ascci === 46 ||
            ascci === 95 ||
            (ascci >= 48 && ascci <= 57)
          ) {
            usuarioValido = true;
          } else {
            usuarioValido = false;
            alert(
              "El correo es inexistente, comprueba los caracteres del usuario"
            );
            break;
          }
        }
      }

      /* validacion de servidor */
      let servidorValido;

      if (servidor.length >= 4) {
        for (let i = 0; i < servidor.length; i++) {
          let ascci = servidor.charCodeAt(i);
          if (ascci >= 97 && ascci <= 122) {
            servidorValido = true;
          } else {
            servidorValido = false;
            alert(
              "El correo es inexistente, comprueba los caracteres del servidor"
            );
            break;
          }
        }
      }

      if (usuarioValido && servidorValido && dominioValido && arrobaValido) {
        return true;
      } else {
        return false;
      }
    }
  }
  registroImportador();
}

document.querySelector("#ingresar").addEventListener("click", estiloIngreso);

function estiloIngreso() {
  ingreso = true;
  registro = false;
  importadorStyle.style.display = "flex";
  registroStyle.style.display = "none";

  let validacionIngreso = false;
  if (ingreso) {
    let usuarioIngreso = document.querySelector("#usuarioIngreso").value;
    let contraseniaIngreso = document.querySelector("#passwordIngreso").value;

    if (
      usuarioIngreso === perfiles[0].nombre &&
      contraseniaIngreso === perfiles[0].password
    ) {
      validacionIngreso = true;
    } else if (usuarioIngreso === "" || contraseniaIngreso === "") {
      validacionIngreso = false;
    } else {
      alert("Alguno de los datos no es correcto");
    }
  }

  let contenedor = document.querySelector("#contenedor");
  let contenedorTotalActividad = document.querySelector(
    "#contenedorTotalActividad"
  );
  let solicitudDeCargaDiv = document.querySelector("#solicitudDeCargaDiv");
  let listaDeSolicitudes = document.querySelector("#listaDeSolicitudes");

  if (validacionIngreso) {
    contenedorTotalActividad.style.display = "flex";
    contenedor.style.display = "none";
    document.querySelector("#nombreImportadorTitulo").innerHTML =
      "Bienvenido " + perfiles[0].nombre;
  }
}
document
  .querySelector("#crearSolicitud")
  .addEventListener("click", crearSolicitudViaje);

function crearSolicitudViaje() {
  solicitudDeCargaDiv.style.display = "flex";
  contenedorTotalActividad.style.display = "none";
}

document
  .querySelector("#listaSoles")
  .addEventListener("click", crearListaSoles);

function crearListaSoles() {
  listaDeSolicitudes.style.display = "flex";
  contenedorTotalActividad.style.display = "none";
}
