const formulario = document.getElementById("formRegistro")

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault()

    const nombre = document.getElementById("nombre").value
    const apellido = document.getElementById("apellido")
    const email = document.getElementById("email").value
    const contraseña = document.getElementById("contraseña").value

    const datos = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        contraseña: contraseña
    }

    console.log(datos)
})