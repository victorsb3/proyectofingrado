<?php
// Recoger usuario y contraseña por POST
$usuario = isset($_POST['usuarioR']) ? $_POST['usuarioR'] : '';
$password = isset($_POST['passwordR']) ? $_POST['passwordR'] : '';
$start = 0;
$start2 = 1;
// Recoger fecha actual
$fechaActual = date('Y-m-d');
try {
    // Establecer conexión con la base de datos
    $conexion = new PDO("mysql:host=localhost;port=3306;dbname=pokemon", "root", "");
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    // Sentencias sql para comprobar que no se repita el nombre de usuario
    $res = $conexion->query("SELECT usuario FROM jugador WHERE usuario = '$usuario'") or die(print($conexion->errorInfo()));
    // Si encuentra el mismo usuario no inserta el jugador
    if ($res->rowCount() == 0) {
        // Sentencias sql
        $pdo = $conexion->prepare('INSERT INTO jugador(usuario, contra, victorias, derrotas, debilitados, conexiones, fecha_alta)VALUES(?,?,?,?,?,?,?)');
        // Rellenar las ?
        $pdo->bindParam(1, $usuario);
        $pdo->bindParam(2, $password);
        $pdo->bindParam(3, $start);
        $pdo->bindParam(4, $start);
        $pdo->bindParam(5, $start);
        $pdo->bindParam(6, $start2);
        $pdo->bindParam(7, $fechaActual);
        // Ejecutar sentencia o forzar cierre con el error
        $pdo->execute() or die(print($pdo->errorInfo()));
        // Si se ha hecho correctamente enviar true en forma de json
        echo json_encode('true');
    } else {
        echo json_encode('false');
    }
} catch (PDOException $error) {
    echo $error->getMessage();
    die();
}
