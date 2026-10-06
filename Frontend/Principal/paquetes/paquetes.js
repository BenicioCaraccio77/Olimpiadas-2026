async function cargarPaquetes() {
    try {
        const respuesta = await fetch("https://olimpiadas-2026-9m46.onrender.com/productos/paquetes")
        const paquetes = await respuesta.json()

        const contenedor = document.querySelector(".PAQUETES")
        contenedor.innerHTML = ""

        const imagenes = [
            "canada.jpg",
            "Grecia.jpg",
            "Eeuu.jpg",
            "sudafrica.jpg",
            "Bariloche.png",
            "Cataratas.jpg"
        ]

        const paginas = [
            "Canada.html",
            "Grecia.html",
            "Eeuu.html",
            "Sudafrica.html",
            "Bariloche.html",
            "Iguazu.html"
        ]

        paquetes.forEach((paquete, indice) => {
            contenedor.innerHTML += `
                <article class="TARJETA">

                    <div class="IMAGEN">
                        <img src="../../img/${imagenes[indice]}" alt="${paquete.nombre}">
                    </div>

                    <div class="INFO">
                        <h3>${paquete.nombre}</h3>

                        <p>${paquete.descripcion || ""}</p>

                        <div class="PRECIO">
                            <strong>$${paquete.precio_unitario}</strong>
                            <span>por persona</span>
                        </div>

                        <div class="BOTONES">

                            <a href="${paginas[indice]}" class="VER-MAS">
                                Ver más
                            </a>

                            <button onclick="agregarAlCarrito('${paquete.producto_id}')">
                                Seleccionar
                            </button>

                        </div>
                    </div>

                </article>
            `
        })

    } catch (error) {
        console.error("Error:", error)
    }
}


function agregarAlCarrito(productoId) {
    const carrito = JSON.parse(sessionStorage.getItem("carrito")) || []

    carrito.push(productoId)

    sessionStorage.setItem("carrito", JSON.stringify(carrito))

    alert("Producto agregado al carrito")
}


cargarPaquetes()