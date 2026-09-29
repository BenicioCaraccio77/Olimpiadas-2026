const formulario = document.getElementById("formRegistro")

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault()

    const nombre = document.getElementById("nombre").value
    const email = document.getElementById("email").value
    const contraseña = document.getElementById("contraseña").value

    const datos = {
        nombre: nombre,
        email: email,
        contraseña: contraseña
    }

    console.log(datos)
})