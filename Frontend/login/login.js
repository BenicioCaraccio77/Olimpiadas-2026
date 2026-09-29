const formulario = document.getElementById("formLogin")

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault()

    const email = document.getElementById("email").value
    const contraseña = document.getElementById("contraseña").value

    const datos = {
        email: email,
        contraseña: contraseña
    }

    console.log(datos);
})