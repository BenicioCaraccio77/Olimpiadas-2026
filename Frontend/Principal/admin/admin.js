
async function cargarCompras() {

    const token =
        localStorage.getItem("access_token")

    if (!token) {

        alert("Tenés que iniciar sesión")

        window.location.href = "../login/login.html"

        return
    }

    try {

        const respuesta = await fetch(
            "https://olimpiadas-2026-9m46.onrender.com/admin/compras",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok || datos.error) {

            alert(
                datos.error ||
                "No se pudieron cargar las compras"
            )

            window.location.href = "../principal.html"

            return
        }

        const contenedor =
            document.getElementById("lista-compras")

        const comprasActivas =
            datos.filter(
                compra => compra.estado !== "cancelada"
            )

        if (comprasActivas.length === 0) {

            contenedor.innerHTML =
                "<p>No hay compras registradas.</p>"

            return
        }

        contenedor.innerHTML = ""

        comprasActivas.forEach(compra => {

            const compraHTML =
                document.createElement("div")

            compraHTML.classList.add("COMPRA")

            compraHTML.innerHTML = `

                <div>

                    <h3>
                        Compra #${compra.compra_id}
                    </h3>

                    <p>
                        Fecha:
                        ${compra.fecha || "Sin fecha"}
                    </p>

                    <p>
                        Total:
                        $${compra.total}
                    </p>

                    <span class="ESTADO">
                        ${compra.estado}
                    </span>

                </div>

                <div class="ACCIONES">

                    <button
                        onclick="verCompra(${compra.compra_id})">
                        Ver
                    </button>

                    <button
                        onclick="editarCompra(${compra.compra_id}, '${compra.estado}')">
                        Editar
                    </button>

                    <button
                        onclick="cancelarCompra(${compra.compra_id})">
                        Cancelar
                    </button>

                </div>

            `

            contenedor.appendChild(compraHTML)

        })

    } catch (error) {

        console.error("Error:", error)

        alert(
            "No se pudo conectar con el servidor"
        )
    }
}


async function verCompra(compraId) {

    const token =
        localStorage.getItem("access_token")

    try {

        const respuesta = await fetch(
            `https://olimpiadas-2026-9m46.onrender.com/admin/compras/${compraId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok || datos.error) {

            alert(
                datos.error ||
                "No se pudieron cargar los detalles"
            )

            return
        }

        const compra = datos.compra
        const detalles = datos.detalles
        const venta = datos.venta

        let productosTexto = ""

        detalles.forEach(detalle => {

            productosTexto +=
                `Producto: ${detalle.producto_id}\n` +
                `Cantidad: ${detalle.cantidad}\n` +
                `Precio: $${detalle.precio}\n\n`

        })

        alert(
            `COMPRA #${compra.compra_id}\n\n` +
            `Fecha: ${compra.fecha}\n` +
            `Total: $${compra.total}\n` +
            `Estado: ${compra.estado}\n\n` +
            `PRODUCTOS\n\n` +
            productosTexto +
            `VENTA\n\n` +
            `Método de pago: ${
                venta
                    ? venta.metodo_pago
                    : "Sin venta"
            }\n` +
            `Estado del pago: ${
                venta
                    ? venta.estado
                    : "Sin venta"
            }`
        )

    } catch (error) {

        console.error("Error:", error)

        alert(
            "No se pudo conectar con el servidor"
        )
    }
}


async function editarCompra(compraId, estadoActual) {

    const nuevoEstado = prompt(
        "Escribí el nuevo estado:\n\n" +
        "pendiente\n" +
        "pagada\n" +
        "cancelada",
        estadoActual
    )

    if (!nuevoEstado) {
        return
    }

    const token =
        localStorage.getItem("access_token")

    try {

        const respuesta = await fetch(
            `https://olimpiadas-2026-9m46.onrender.com/admin/compras/${compraId}?estado=${encodeURIComponent(nuevoEstado)}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok || datos.error) {

            alert(
                datos.error ||
                "No se pudo editar la compra"
            )

            return
        }

        alert("Compra actualizada correctamente")

        cargarCompras()

    } catch (error) {

        console.error("Error:", error)

        alert(
            "No se pudo conectar con el servidor"
        )
    }
}


async function cancelarCompra(compraId) {

    const confirmar = confirm(
        `¿Querés cancelar la compra #${compraId}?`
    )

    if (!confirmar) {
        return
    }

    const token =
        localStorage.getItem("access_token")

    try {

        const respuesta = await fetch(
            `https://olimpiadas-2026-9m46.onrender.com/admin/compras/${compraId}?estado=cancelada`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )

        const datos = await respuesta.json()

        if (!respuesta.ok || datos.error) {

            alert(
                datos.error ||
                "No se pudo cancelar la compra"
            )

            return
        }

        alert("Compra cancelada correctamente")

        cargarCompras()

    } catch (error) {

        console.error("Error:", error)

        alert(
            "No se pudo conectar con el servidor"
        )
    }
}

cargarCompras()
