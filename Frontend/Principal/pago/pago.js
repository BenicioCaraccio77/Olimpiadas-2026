
async function cargarResumen() {

    const carrito =
        JSON.parse(sessionStorage.getItem("carrito")) || []

    if (carrito.length === 0) {

        alert("El carrito está vacío")

        window.location.href = "../carrito/carrito.html"

        return
    }

    try {

        const respuesta = await fetch(
            "https://olimpiadas-2026-9m46.onrender.com/productos"
        )

        const productos = await respuesta.json()

        const cantidades = {}

        carrito.forEach(productoId => {

            cantidades[productoId] =
                (cantidades[productoId] || 0) + 1

        })

        let total = 0

        Object.keys(cantidades).forEach(productoId => {

            const producto =
                productos.find(
                    p => p.producto_id === productoId
                )

            if (!producto) {
                return
            }

            total +=
                Number(producto.precio_unitario) *
                cantidades[productoId]

        })

        document.getElementById("total").textContent =
            `$${total}`

    } catch (error) {

        console.error("Error:", error)

        alert("No se pudo cargar el resumen")
    }
}


document.getElementById("confirmar").addEventListener("click", async () => {

    const metodo =
        document.querySelector(
            'input[name="metodo"]:checked'
        )

    if (!metodo) {

        alert("Elegí un método de pago")

        return
    }

    const token =
        localStorage.getItem("access_token")

    if (!token) {

        alert("Tenés que iniciar sesión")

        return
    }

    const carrito =
        JSON.parse(sessionStorage.getItem("carrito")) || []

    if (carrito.length === 0) {

        alert("El carrito está vacío")

        return
    }

    try {

        const respuestaProductos = await fetch(
            "https://olimpiadas-2026-9m46.onrender.com/productos"
        )

        const productos =
            await respuestaProductos.json()

        const cantidades = {}

        carrito.forEach(productoId => {

            cantidades[productoId] =
                (cantidades[productoId] || 0) + 1

        })

        let total = 0

        const productosCompra =
            Object.keys(cantidades).map(productoId => {

                const producto =
                    productos.find(
                        p => p.producto_id === productoId
                    )

                const cantidad =
                    cantidades[productoId]

                total +=
                    Number(producto.precio_unitario) *
                    cantidad

                return {
                    producto_id: productoId,
                    cantidad: cantidad,
                    precio: Number(
                        producto.precio_unitario
                    )
                }
            })

        console.log("¿Token existe?:", !!token)
        console.log("Longitud token:", token ? token.length : 0)
        console.log(
            "Inicio token:",
            token ? token.substring(0, 10) : "NO HAY TOKEN"
        )

        const respuesta = await fetch(
            `https://olimpiadas-2026-9m46.onrender.com/compras?total=${total}&metodo_pago=${encodeURIComponent(metodo.value)}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(productosCompra)
            }
        )

        const datos =
            await respuesta.json()

        if (!respuesta.ok || datos.error) {

            alert(
                datos.error ||
                "No se pudo confirmar el pago"
            )

            return
        }

        sessionStorage.removeItem("carrito")

        alert("Pago confirmado correctamente")

        window.location.href =
            "../principal.html"

    } catch (error) {

        console.error("Error:", error)

        alert(
            "No se pudo conectar con el servidor"
        )
    }

})


cargarResumen()

