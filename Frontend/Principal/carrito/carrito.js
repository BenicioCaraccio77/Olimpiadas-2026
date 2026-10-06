async function cargarCarrito() {

    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || []

    const contenedor = document.getElementById("productos-carrito")
    const totalElemento = document.getElementById("total")

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>"
        totalElemento.textContent = "$0"
        return
    }

    try {

        const respuesta = await fetch(
            "https://olimpiadas-2026-9m46.onrender.com/productos"
        )

        const productos = await respuesta.json()

        contenedor.innerHTML = ""

        const cantidades = {}

        carrito.forEach(productoId => {
            cantidades[productoId] = (cantidades[productoId] || 0) + 1
        })

        let total = 0

        Object.keys(cantidades).forEach(productoId => {

            const producto = productos.find(
                p => p.producto_id === productoId
            )

            if (!producto) {
                return
            }

            const cantidad = cantidades[productoId]
            const subtotal = Number(producto.precio_unitario) * cantidad

            total += subtotal

            contenedor.innerHTML += `
                <div class="PRODUCTO-CARRITO">

                    <div>
                        <h3>${producto.nombre}</h3>

                        <p>
                            ${producto.descripcion || ""}
                        </p>

                        <strong>
                            $${producto.precio_unitario}
                        </strong>
                    </div>

                    <div class="CANTIDAD">

                        <button onclick="cambiarCantidad('${productoId}', -1)">
                            −
                        </button>

                        <span>
                            ${cantidad}
                        </span>

                        <button onclick="cambiarCantidad('${productoId}', 1)">
                            +
                        </button>

                    </div>

                    <div>

                        <p>
                            Subtotal: $${subtotal}
                        </p>

                        <button onclick="eliminarProducto('${productoId}')">
                            Eliminar
                        </button>

                    </div>

                </div>
            `
        })

        totalElemento.textContent = `$${total}`

    } catch (error) {

        console.error("Error al cargar el carrito:", error)

        contenedor.innerHTML =
            "<p>No se pudieron cargar los productos.</p>"
    }
}


function cambiarCantidad(productoId, cambio) {

    let carrito =
        JSON.parse(sessionStorage.getItem("carrito")) || []

    if (cambio === 1) {

        carrito.push(productoId)

    }

    if (cambio === -1) {

        const posicion = carrito.indexOf(productoId)

        if (posicion !== -1) {
            carrito.splice(posicion, 1)
        }
    }

    sessionStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    )

    cargarCarrito()
}


function eliminarProducto(productoId) {

    let carrito =
        JSON.parse(sessionStorage.getItem("carrito")) || []

    carrito = carrito.filter(
        id => id !== productoId
    )

    sessionStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    )

    cargarCarrito()
}


cargarCarrito()

document.getElementById("comprar").addEventListener("click", () => {

    const carrito =
        JSON.parse(sessionStorage.getItem("carrito")) || []

    if (carrito.length === 0) {

        alert("El carrito está vacío")

        return
    }

    window.location.href = "../pago/pago.html"
})