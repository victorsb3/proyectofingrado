// Capturar el evento del boton aceptar del formulario
document.getElementById('formR').addEventListener('submit', function(e){
    // Para que no redirija a otra pagina y funcione de manera asincrona
    e.preventDefault();
    // Para poder capturar el formulario y poder mandarlo con fetch()
    let formR = new FormData(document.getElementById('formR'));
    // Guardar en variable local el nombre y contraseña
    localStorage.usuarioNombre=document.getElementById('usuarioR').value;
    localStorage.usuarioContra=document.getElementById('passwordR').value;
    // Enviar los datos del formulario al php
    fetch('insertar.php',{
        method:'POST',
        body: formR
    })
    // Retornar lo que genera el insertar.php a un formato json
    .then(res=>res.json())
    // Si devuelve true el php redirige la pagina a inicio
    .then(data=>{
        if(data == 'true'){
            document.getElementById('usuarioR').value = '';
            document.getElementById('passwordR').value = '';
            window.location.href=("http://localhost/pokemon-cesfuencarral/inicio.html");
        } else if(data == 'false'){
            //console.log(data);
            alert("El nombre de usuario ya existe");
            window.location.href=("http://localhost/pokemon-cesfuencarral/index.html");
        }
    });
});

