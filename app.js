// Peticion a archivo
fetch('listar.php')
// Retornar lo que genera el listar.php a un formato json
.then(res=>res.json())
.then(data =>{
    //console.log(data);
    let str = '';
    // Mapear la tabla con el data obtenido del php
    data.map(item => {
        // Guardar tabla en str
        str += `
            <tr>
                <td>${item.usuario}</td>
                <td>${item.victorias}</td>
                <td>${item.derrotas}</td>
                <td>${item.debilitados}</td>
                <td>${item.fecha_alta}</td>
            </tr>
        `
    })
    // Añadir las filas a la tabla
    document.getElementById('table_data').innerHTML = str;
})