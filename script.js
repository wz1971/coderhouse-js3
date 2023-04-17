verificarEdad()
autenticarUsuario()

//Capturar click en nav "comprar"
let navComprar = document.getElementById("comprar")
navComprar.addEventListener("click", listarTodo)

//Capturar click en nav "inicio" o en logo
let inicio = document.getElementById("inicio")
inicio.addEventListener("click", recargarPagina)
let logo = document.getElementsByClassName("navbar-brand")
logo[0].addEventListener("click", recargarPagina)

//Capturar click en nav "contacto" y renderizar página
let contacto = document.getElementById("contacto")
contacto.addEventListener("click", () => {
  wrapper.innerHTML = `
    <div class="contacto-items">
    <div id="contacto-text">
        <h2>¿Dónde estamos?</h2>
        <p>Hortiguera 1500<br>
            C1406CMF CABA<br>
            +54-9-11-2222-3333
        </p>
    </div>
    <div id="contacto-map">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13130.680086145061!2d-58.44976913022461!3d-34.6377782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccbca6ef4dbcd%3A0x44e45f4dd6dc7d06!2sHortiguera%201500%2C%20C1406CMF%20CABA!5e0!3m2!1ses-419!2sar!4v1669993430160!5m2!1ses-419!2sar"
        width="720" height="540" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
</div>
`
})

//Capturar click en "carrito" y renderizar
let verCarrito = document.getElementById("carrito")
verCarrito.addEventListener("click", renderizarCarrito)

//Capturar Botón Buscar
let botonBuscar = document.getElementById("botonBuscar")
botonBuscar.addEventListener("click", buscarProducto)

function renderizarLista(arrayProductos) {
  let workArea = document.getElementById("wrapper")
  workArea.innerHTML = ""
  arrayProductos.forEach(({ id, nombre, precio, categoria, img, descripcion }) => {
    let tarjetaProd = document.createElement("div")
    tarjetaProd.classList = "card text-white bg-secondary tarjetaProd"
    tarjetaProd.innerHTML = `<img src="${img}" class="card-img-top" alt="${nombre}">
        <div class="card-body">
          <h3 class="card-title">${nombre}</h3>  
          <h4 class="card-title">${categoria}</h4>
          <p class="card-text">${descripcion}</p>
          <div class="card-price" >
            <a href="#" class="btn btn-dark btnComprar" id="${id}">Agregar</a>
            <h5>\$${precio}</h5>
          </div>
        </div>`
    workArea.appendChild(tarjetaProd)
    //Capturar boton Agregar
    let botonAgregar = document.getElementById(id)
    botonAgregar.addEventListener("click", agregarAlCarrito)
  })
}

function listarTodo() {
  let autenticado = localStorage.getItem("autenticado")
  if (autenticado) {
    renderizarLista(productList)
  } else {
    autenticarUsuario()
  }
}

function recargarPagina() {
  location.reload()
}

function agregarAlCarrito(e) {
  let carrito = JSON.parse(localStorage.getItem("carritoJSON")) || []
  let productoAgregado = productList.find((producto) => producto.id === Number(e.target.id))
  if (carrito.some((producto) => producto.id == productoAgregado.id)) {
    let index = carrito.findIndex((producto) => producto.id == productoAgregado.id)
    carrito[index].unidades++
    carrito[index].subtotal = carrito[index].precio * carrito[index].unidades
  } else {
    carrito.push({
      id: productoAgregado.id,
      nombre: productoAgregado.nombre,
      precio: productoAgregado.precio,
      unidades: 1,
    })
  }
  // Guardar como JSON en localStorage
  let carritoJSON = JSON.stringify(carrito)
  localStorage.setItem("carritoJSON", carritoJSON)
  // To Do Mostrar un alert de confirmación con algunos datos del producto antes de agregar al carrito
}

function verificarEdad() {
  let mayor = sessionStorage.getItem("esMayor")
  !mayor &&
    Swal.fire({
      title: "Eres mayor de 18 años?",
      text: "Esta página es sólo para mayores de 18",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Sí, soy mayor",
      denyButtonText: "No, soy menor",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem("esMayor", true)
        Swal.fire("Bienvenido a The Cave!", "", "success")
      } else if (result.isDenied) {
        Swal.fire("Ingreso no permitido a menores de edad", "", "error")
        window.location.replace("https://www.google.com/")
      }
    })
}

function autenticarUsuario() {
  let autenticado = localStorage.getItem("autenticado")
  !autenticado &&
    Swal.fire({
      title: "Ingresar al sistema",
      html: `<input type="text" id="login" class="swal2-input" placeholder="Usuario">
            <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
      confirmButtonText: "Entrar",
      focusConfirm: false,
      preConfirm: () => {
        const login = Swal.getPopup().querySelector("#login").value
        const password = Swal.getPopup().querySelector("#password").value
        if (!login || !password) {
          Swal.showValidationMessage(`Please enter login and password`)
        }
        localStorage.setItem("usuario", login)
        localStorage.setItem("password", password)
        return { login: login, password: password }
      },
    }).then((result) => {
      Swal.fire(`Autenticando: ${result.value.login}`.trim())

      let usuario = localStorage.getItem("usuario")
      let password = localStorage.getItem("password")
      if (usuario === "walter" && password === "passwd") {
        localStorage.setItem("autenticado", true)
        niceAlert("Bienvenido " + usuario)
      }
    })
}

function renderizarCarrito() {
  let carritoGuardado = localStorage.getItem("carritoJSON")
  carritoGuardado = JSON.parse(carritoGuardado)
  if (!carritoGuardado || carritoGuardado.length === 0) {
    niceAlert("No hay elementos en el carrito")
  } else {
    let workArea = document.getElementById("wrapper")
    workArea.innerHTML = ""
    let mostrarCarrito = document.createElement("div")
    mostrarCarrito.innerHTML = `
        <div class="carrito-body" id="carritoList">
          <h5>Carrito de Compras</h5>
          <h6>Nombre\t\tCantidad\t\tImporte</h6>
        </div>`
    workArea.appendChild(mostrarCarrito)
    let listarItem = document.getElementById("carritoList")
    carritoGuardado.forEach((producto) => {
      //Agregar línea a modal
      let linea = document.createElement("p")
      linea.innerText = `${producto.nombre}: ${producto.unidades}u\t\$${producto.subtotal}`
      listarItem.appendChild(linea)
    })
  }
}

function descontarStock() {
  // To Do Manejar el stock de cada producto
}

// To Do Descontar del Carrito
function descontarDeCarrito() {}

function vaciarCarrito() {
  localStorage.setItem("carritoJSON", "")
}

function buscarProducto() {
  //Capturar cuadro de búsqueda
  let buscador = document.getElementById("textoBuscar").value.toLowerCase()
  if (!buscador) {
    niceAlert("Ingrese texto a buscar")
  }
  let arrayResultados = productList.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(buscador) || producto.categoria.toLowerCase().includes(buscador)
  )
  if (arrayResultados.length === 0) {
    arrayResultados = [...productList]
  }
  renderizarLista(arrayResultados)
}

function niceAlert(text) {
  // Muestra alertas con Sweet Alert2
  alert(text)
}

function finalizarCompra() {
  // To Do Terminar la compra y limpiar el carrito del storage.
}
