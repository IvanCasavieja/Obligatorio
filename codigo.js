//EMPEZAMOS CREANDO EL ARRAY Y LA CLASE, CON LAS INSTRUCCIONES PARA EL CONSTRUCTOR.

let solicitudes = [];

class Solicitud {
  constructor(
    tipoC,
    pOrigenC,
    cantC,
    descripcionC,
    id,
    IDEmpresa,
    numViajeC,
    usuarioActivo
  ) {
    this.tipo = tipoC;
    this.origen = pOrigenC;
    this.cantContenedores = cantC;
    this.descripcion = descripcionC;
    this.id = id;
    this.empresa = IDEmpresa;
    this.numeroViaje = numViajeC;
    this.estado = "pendiente";
    this.importador = usuarioActivo;
  }
}

//FUNCION PARA LISTAR LAS SOLICITUDES. ESTA DECLARADA ACA PERO FIGURA MAS ABAJO EXPLICADA
listarPendientes();

let idSolicitudActual = 1;
document
  .querySelector("#btnIngresoSolicitud")
  .addEventListener("click", agregarSolicitud);

function agregarSolicitud() {
  let tip = document.querySelector("#slcTipoCarga").value;
  let tipo;
  switch (tip) {
    case "CG":
      tipo = "general";
      break;
    case "CR":
      tipo = "refrigerada";
      break;
    case "CP":
      tipo = "PELIGROSA";
      break;
  }
  let origen = document.querySelector("#txtOrigen").value;
  let cantidadCont = Number(document.querySelector("#txtCantidadCont").value);
  let descripcion = document.querySelector("#txtDescripcion").value;
  let id = idSolicitudActual;
  idSolicitudActual++;
  //let usuarioActivo =
  if (
    tip !== "xx" &&
    origen !== "" &&
    !isNaN(cantidadCont) &&
    cantidadCont > 0 &&
    descripcion !== ""
  ) {
    let solicitud = new Solicitud(
      tipo,
      origen,
      cantidadCont,
      descripcion,
      id,
      "-1",
      "-1"
    ); //usuarioActivo);
    solicitudes.push(solicitud);
    listarPendientes();
  } else {
    alert(
      "Por favor, revise los datos ingresados. Puede haber campos en blanco (o que no haya seleccionado el tipo de carga)"
    );
  }
}
//ACA DESARROLLO LA FUNCION QUE HACE LA LISTA
function listarPendientes() {
  document.querySelector("#tblPendientesImp").innerHTML = "";
  for (let i = 0; i < solicitudes.length; i++) {
    const solicitud = solicitudes[i];
    if (solicitud.estado != "<b>cancelada<b/>") {
      document.querySelector("#tblPendientesImp").innerHTML += `<tr>
          <td>${solicitud.tipo}</td>
          <td>${solicitud.origen}</td>
          <td>${solicitud.cantContenedores}</td>
          <td>${solicitud.descripcion}</td>
          <td>${solicitud.id}</td>
          <td>${solicitud.estado}</td>
          <td><input type="button" value="Cancelar solicitud pendiente" data-solicitud="${solicitud.id}" class="cancelar"></td>
          </tr>`;
    }
  }

  let botonesCanc = document.querySelectorAll(".cancelar");
  for (let i = 0; i < botonesCanc.length; i++) {
    const botonCanc = botonesCanc[i];
    botonCanc.addEventListener("click", cancelarSolicitud);
  }
}
//FUNCION QUE BUSCA ELEMENTOS. VA A SER LLAMADAS EN DISTINTAS FUNCIONES.
function buscarElemento(arr, prop, valor) {
  let elementoBuscado = null;
  for (let i = 0; i < arr.length; i++) {
    const elem = arr[i];
    if (elem[prop] === valor) {
      elementoBuscado = elem;
      break;
    }
  }
  return elementoBuscado;
}

/* sistema de volver */

let volverbtns = document.querySelectorAll(".volver");

for (let i; i < volverbtns.length; i++) {
  volverbtns[i].addEventListener("click", volverFunction);
}

function volverFunction() {
  solicitudDeCargaDiv.style.display = "none";
  contenedorTotalActividad.style.display = "flex";
}

//FUNCION PARA CANCELAR SOLICITUDES. INCLUYE LA INVOCACION A UNA FUNCION QUE RECORRE EL ARRAY Y VERIFICA SI SE LLEGO AL MAXIMO DE 3 CANCELADAS
//PARA DESHABILITAR AL IMPORTADOR.
let solicitudesCanceladas = 0;

function cancelarSolicitud() {
  //if(solicitudesCanceladas <= 2){
  let idSolicitudCancelar = Number(this.getAttribute("data-solicitud"));
  let solicitudCancelar = buscarElemento(
    solicitudes,
    "id",
    idSolicitudCancelar
  );
  let hacer = confirm(
    "¿Esta seguro/a que quiere cancelar esta solicitud de " +
      solicitudCancelar.descripcion +
      "?"
  );
  if (hacer) {
    solicitudCancelar.estado = "<b>cancelada<b/>";
    listarPendientes();
  }

  validacionInhabilitadas = verificarCanceladas(solicitudes);
  if (validacionInhabilitadas) {
    alert(
      "Ha excedido el límite de solicitudes canceladas, por lo que queda temporalmente inhabilitado para operar"
    );
    //acá cambiar perfil de importador a inhabilitado. Para esto faltan las partes 1 y 2 de Ivan.
  }
}

//FUNCION QUE ES LLAMADA POR LA FUNCION DE CANCELACIONES, PARA VERIFICAR SI UN IMPORTADOR LLEGO A TRES CANCELACIONES
function verificarCanceladas(array) {
  let cantCanceladas = 0;
  let deshabilitar = false;
  for (let i = 0; i < array.length; i++) {
    const solicitud = array[i];
    if (solicitud.estado === "<b>cancelada<b/>") {
      cantCanceladas++;
    }
  }
  if (cantCanceladas === 3) {
    deshabilitar = true;
  }
  return deshabilitar;
}

document
  .querySelector("#btnFiltrarBusqueda")
  .addEventListener("click", buscarYTabla);

//funcion para funcionalidad 4 (filtrar busqueda solicitudes pendientes de importador);
function buscarYTabla() {
  //vacio tabla y la armo otra vez, solo con los que coincidan con la busqueda.
  document.querySelector("#tblPendientesImp").innerHTML = "";
  let busq = document.querySelector("#txtBusquedaDescripcion").value;
  let busqueda = busq.toLowerCase();
  for (let i = 0; i < solicitudes.length; i++) {
    const solicitud = solicitudes[i];
    let solicMin = solicitud.descripcion.toLowerCase();
    if (solicMin.indexOf(busqueda) !== -1) {
      document.querySelector("#tblPendientesImp").innerHTML += `<tr>
                <td>${solicitud.tipo}</td>
                <td>${solicitud.origen}</td>
                <td>${solicitud.cantContenedores}</td>
                <td>${solicitud.descripcion}</td>
                <td>${solicitud.id}</td>
                <td>${solicitud.estado}</td>
                <td><input type="button" value="Cancelar solicitud pendiente" data-solicitud="${solicitud.id}" class="cancelar"></td>
                </tr>`;
    }
  }
  let botonesCanc = document.querySelectorAll(".cancelar");
  for (let i = 0; i < botonesCanc.length; i++) {
    const botonCanc = botonesCanc[i];
    botonCanc.addEventListener("click", cancelarSolicitud);
    //esto hay que optimizarlo. Habria que hacer un nuevo array SOLO CON LOS ELEMENTOS BUSCADOS, y a ese array asignarle las funcion del boton,
    //como para no repetir esto de botones Elim dos veces.
  }
}

//FUNCIONALIDAD 5, ESTADISTICA

//tengo que recibir el ID de las solicitudes confirmadas por las empresas para todas estas partes.

//hice esta de abajo como reutilizable pero no se si la voy a usar. Fijarnos despues que no quede redundante. Porque al final para
//contar las canceladas y deshabilitar hice otra.
function contarSolicitudes(array, estado) {
  contador = 0;
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element.estado === estado) {
      contador++;
    }
  }
  return contador;
}
function porcentajeCanceladas(
  cantidadCanc,
  cantidadConf,
  cantidadPend,
  cantidadIgno
) {
  let total = cantidadCanc + cantidadConf + cantidadPend + cantidadIgno;
  let porcentajeCanceladas = (cantidadCanc / total) * 100;
  return porcentajeCanceladas;
}

//Calendario:

function participacionLineas(
  enviosLinea1,
  enviosLinea2,
  enviosLinea3,
  enviosLinea4
) {
  let total = enviosLinea1 + enviosLinea2 + enviosLinea3 + enviosLinea4;
  //para mostrar varios returns, uno para cada linea, puedo crear un array aca.
  //habria que ver si no es un array con el que ya vamos a estar trabajando, y ahi es solo pedirlo como parametro.
}

// - RESUELTO ///en el filtrado, que anda, despues no puedo cancelar. El boton no anda. Pero estaba pensando, cuando cree la tabla otra vez, va a crear toda
//la tabla otra vez. No me va a hacer la tabla con solo los de la busqueda. Conviene hacer eso? ME DIJO QUE NO. ALCANZA CON QUE VUELVA A LA
//TABLA ORIGINAL (menos el eliminado).

//el importador puede seguir agregando solicitudes una vez inhabilitado? Porque dependiendo de eso cambia como instrumento esa funcion.
// (tengo) comentada la alternativa porque es la que habia usado al principio. SI. PUEDE SEGUIR AGREGANDO SOLICITUDES.
//en la funcion para cancelar, me queda lo de inhabilitar linkeado al boton de "cancelar solicitud". Donde lo puedo poner para que no me pase?

//RESUELTO. el importador puede ver listados todas las solicitudes o hay que filtrar por pendientes nada mas? Aunque mientras  el las agrega son todas
//pndientes. Asumo que habria que hacer un filtrado despues de que la empresa acepte solicitudes. SOLO TIENE QUE VER LAS PENDIENTES.

//RESUELTO. usamos un mismo array para todos los estados de solicitudes? O trabajamos con varios? UNO SOLO, MIRAMOS LOS ESTADOS.
