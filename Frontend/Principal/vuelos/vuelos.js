async function cargarVuelos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/productos/vuelos")
        const vuelos = await respuesta.json()

        const tarjetas = document.querySelector(".TARJETAS")
        tarjetas.innerHTML = ""

        vuelos.forEach(vuelo => {
            tarjetas.innerHTML += `
                <article class="TARJETA">
                    <div>
                        <h3>${vuelo.nombre}</h3>
                        <p>${vuelo.descripcion || ""}</p>
                    </div>

                    <div class="DATOS">
                        <span>Vuelo CATB</span>
                        <span>Directo</span>
                    </div>

                    <div class="PRECIO">
                        <strong>$${vuelo.precio_unitario}</strong>
                        <span>por persona</span>
                    </div>

                    <button onclick="agregarAlCarrito('${vuelo.producto_id}')">
                        Seleccionar
                    </button>
                </article>
            `
        })

    } catch (error) {
        console.error("Error:", error)
    }
}
cargarVuelos()

function agregarAlCarrito(productoId) {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || []

    carrito.push(productoId)

    sessionStorage.setItem("carrito", JSON.stringify(carrito))

    alert("Producto agregado al carrito")
}