<?php
// Recoger usuario y contraseña por POST
$usuario = isset($_POST['usuarioL']) ? $_POST['usuarioL'] : '';
$password = isset($_POST['passwordL']) ? $_POST['passwordL'] : '';
$encontrado='false';
try {
    // Establecer conexión
    $conexion = new PDO("mysql:host=localhost;port=3306;dbname=pokemon", "root", "");
    // Control de errores
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    // Sentencias sql
    $res = $conexion->query("SELECT usuario, contra FROM jugador WHERE usuario = '$usuario' AND contra = '$password'") or die(print($conexion->errorInfo()));
    $res2 = $conexion->query("UPDATE jugador SET conexiones = conexiones + 1 WHERE usuario = '$usuario' AND contra = '$password'" );
    // Si encuentra un usario y contraseña coincidentes con el formulario devuelve true
    if ($res->rowCount() == 0){
        $encontrado='false';
    } else {
        $encontrado='true';
    }
    // Pasar el json con el resultado de encontrado
    echo json_encode($encontrado);
} catch (PDOException $error) {
    echo $error->getMessage();
    die();
}

?>

