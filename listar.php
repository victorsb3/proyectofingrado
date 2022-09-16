<?php
try{
  // Establecer conexion con la base de datos
  $conexion = new PDO("mysql:host=localhost;port=3306;dbname=pokemon","root","");
  // Control de errores
  $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
  // Sentencia sql
  $res = $conexion->query('SELECT usuario, victorias, derrotas, debilitados, fecha_alta FROM jugador ORDER BY victorias DESC') or die (print($conexion->errorInfo()));
  // Array vacio
  $data = [];
  // Recoger los resultados de la sentencia en data
  while($item = $res->fetch(PDO::FETCH_OBJ)){
    $data[] = [
        'usuario' => $item->usuario,
        'victorias' => $item->victorias,
        'derrotas' => $item->derrotas,
        'debilitados' => $item->debilitados,
        'fecha_alta' => $item->fecha_alta
    ];
  }
  // Mandar por json data
  echo json_encode($data);
} catch(PDOException $error){
    echo $error->getMessage();
    die(); 
}
