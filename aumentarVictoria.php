<?php
$nombre = $_POST['nombre'];
$contra = $_POST['contra'];

try {
    $conexion = new PDO("mysql:host=localhost;port=3306;dbname=pokemon", "root", "");
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

    $res1 = $conexion->query("UPDATE jugador SET victorias = victorias + 1 WHERE usuario = '$nombre' AND contra = '$contra'" );
    $res2 = $conexion->query("UPDATE jugador SET debilitados = debilitados + 1 WHERE usuario = '$nombre' AND contra = '$contra'" );

    echo "Entra";
} catch (PDOException $error) {
    echo $error->getMessage();
    die();
}

 