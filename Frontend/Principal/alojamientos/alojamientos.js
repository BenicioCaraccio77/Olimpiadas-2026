async function cargarAlojamientos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/productos/alojamientos")
        const alojamientos = await respuesta.json()

        const contenedor = document.querySelector(".ALOJAMIENTOS")
        contenedor.innerHTML = ""

        alojamientos.forEach((alojamiento, indice) => {
            contenedor.innerHTML += `
                <div class="TARJETA">
                    <div class="IMAGEN">
                        <img src="${indice === 0 ? '../../img/hotel1.webp' : indice === 1 ? '../../img/hotel2.webp' : '../../img/hotel3.jpg'}" alt="${alojamiento.nombre}">
                    </div>

                    <div class="INFO">
                        <h2>${alojamiento.nombre}</h2>
                        <p class="UBICACION"> ${indice === 0 ? "Buenos Aires, Argentina" : indice === 1 ? "Madrid, España" : "París, Francia"}</p>
                        <p>${alojamiento.descripcion}</p>

                        <div class="DETALLES">
                            <span>${indice === 0 ? "4.8" : indice === 1 ? "4.6" : "4.7"}</span>
                            <span>${indice === 2 ? "Departamento" : "Habitación doble"}</span>
                        </div>

                        <div class="PRECIO">
                            <strong>$${alojamiento.precio_unitario}</strong>
                            <span>por noche</span>
                        </div>

                        <button class="BOTON" onclick="agregarAlCarrito('${alojamiento.producto_id}')">
                            Seleccionar
                        </button>
                    </div>
                </div>
            `
        })
    } catch (error) {
        console.error("Error:", error)
    }
}

cargarAlojamientos()

function agregarAlCarrito(productoId) {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || []

    carrito.push(productoId)

    sessionStorage.setItem("carrito", JSON.stringify(carrito))

    alert("Producto agregado al carrito")
}