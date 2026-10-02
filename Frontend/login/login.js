const formulario = document.getElementById("formLogin")

formulario.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("contraseña").value

    try {
        const respuesta = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const datos = await respuesta.json()

        if (respuesta.ok) {

            localStorage.setItem(
                "access_token",
                datos.access_token
            )

            const respuestaAdmin = await fetch(
                "http://127.0.0.1:8000/admin/verificar",
                {
                    headers: {
                        "Authorization": `Bearer ${datos.access_token}`
                    }
                }
            )

            const datosAdmin =
                await respuestaAdmin.json()

            if (datosAdmin.admin) {

                window.location.href =
                    "../Principal/admin/admin.html"

            } else {

                window.location.href =
                    "../Principal/principal.html"

            }

        } else {

            alert("Error al iniciar sesión")

        }

    } catch (error) {
        alert("No se pudo conectar con el servidor")
    }
})