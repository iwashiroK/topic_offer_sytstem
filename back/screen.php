<?php
  $pdo_dsn = 'mysql:host=127.0.0.1;dbname=topic_db_20220129;charset=utf8mb4';
  $pdo_user = 'root';
  $pdo_pass = 'sopPy6020';
  $pdo_option = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::ATTR_STRINGIFY_FETCHES => false
  );	
  
  try {
    $pdo = new PDO($pdo_dsn, $pdo_user, $pdo_pass, $pdo_option);
  } catch (Exception $e) {
    header('Content-Type: text/plain; charset=UTF-8', true, 500);
    exit($e->getMessage());
    echo $e->getMessage();
    echo "接続失敗";
  }
  
  try{
    $stmt = $pdo->query('SELECT * from topictable');
    $topic = [];
    $count = 0;
    while ($row = $stmt->fetch()) {
      $topic[$count] = $row['topic'];
      $count++;
    }
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    //echo $topic;
    echo json_encode($topic, JSON_UNESCAPED_UNICODE);
  } catch (PDOException $e) {
    echo $e->getMessage() . PHP_EOL;
    echo $e->getMessage();
    echo "接続失敗";
    exit;
  }
  $pdo = null;
?>