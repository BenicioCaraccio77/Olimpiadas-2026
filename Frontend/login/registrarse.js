const formulario = document.getElementById("formRegistro")

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("contraseña").value

    try {
        const respuesta = await fetch("https://olimpiadas-2026-9m46.onrender.com/registro", {
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
            alert("Usuario registrado correctamente")
            window.location.href = "login.html"
        } else {
            alert("Error al registrarse")
        }

    } catch (error) {
        alert("No se pudo conectar con el servidor")
    }
})