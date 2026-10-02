async function cargarAutos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/productos/autos")
        const autos = await respuesta.json()

        const contenedor = document.querySelector(".TARJETAS")
        contenedor.innerHTML = ""

        autos.forEach((auto, indice) => {
            contenedor.innerHTML += `
                <article class="TARJETA">

                    <div class="IMAGEN">
                        <img src="../../img/${indice === 0 ? "auto1.jpg" : indice === 1 ? "auto2.jpg" : "auto3.webp"}" alt="${auto.nombre}">
                    </div>

                    <div class="INFO">
                        <h3>${auto.nombre}</h3>

                        <p class="TIPO">${auto.descripcion}</p>

                        <div class="DATOS">
                            <span>5 pasajeros</span>
                            <span>2 valijas</span>
                            <span>Automático</span>
                        </div>

                        <div class="PRECIO">
                            <strong>$${auto.precio_unitario}</strong>
                            <span>por día</span>
                        </div>

                        <button onclick="agregarAlCarrito('${auto.producto_id}')">
                            Seleccionar
                        </button>
                    </div>

                </article>
            `
        })

    } catch (error) {
        console.error("Error:", error)
    }
}

cargarAutos()

function agregarAlCarrito(productoId) {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || []

    carrito.push(productoId)

    sessionStorage.setItem("carrito", JSON.stringify(carrito))

    alert("Producto agregado al carrito")
}