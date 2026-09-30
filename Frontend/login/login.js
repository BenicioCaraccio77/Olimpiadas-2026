const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;

    try {

        const respuesta = await fetch(
            `http://127.0.0.1:8000/login?email=${encodeURIComponent(email)}&contraseña=${encodeURIComponent(contraseña)}`,
            {
                method: "POST"
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.detail);
            return;
        }

        alert("Inicio de sesión correcto");

        // Guardamos los datos del usuario
        localStorage.setItem("cliente_id", datos.cliente_id);
        localStorage.setItem("nombre", datos.nombre);
        localStorage.setItem("email", datos.email);

        // Mandamos al usuario a la página principal
        window.location.href = "../Principal/index.html";

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor");
    }
});