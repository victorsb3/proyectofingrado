// Capturar el evento del boton aceptar del formulario
document.getElementById('formL').addEventListener('submit', function(e){
    // Para que no redirija a otra pagina y funcione de manera asincrona
    e.preventDefault();
    // Guardar en variable local el nombre y contraseña
    localStorage.usuarioNombre=document.getElementById('usuarioL').value;
    localStorage.usuarioContra=document.getElementById('passwordL').value;
    // Para poder capturar el formulario y poder mandarlo con fetch()
    let formL = new FormData(document.getElementById('formL'));
    // Enviar los datos del formulario al php
    fetch('login.php',{
        method:'POST',
        body: formL
    })
    // Entonces -> Recibir true o false del php a traves de json
    .then(res=>res.json())
    // Entonces -> Si verifica que son correcto los datos:
    .then(encontrado => {
        // Dirige al menu de inicio de la pagina
        if(encontrado=="true"){
            window.location.href=("http://localhost/pokemon-cesfuencarral/inicio.html");
        }else{
        // Dirige a la pagina de los formularios
            alert("Nombre de usuario o contraseña incorrectos");
            window.location.href=("http://localhost/pokemon-cesfuencarral/index.html");
        }
    });
});

