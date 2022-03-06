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
    $select_all = 'SELECT * from topictable where category_id != ';
    $query = '';
    $checked_categories = [];
    $topic = [];
    $query_count = 0;
    $fetch_count = 0;

    header("Access-Control-Allow-Origin: *");
    //フロントからチェックされたカテゴリーを取得する
    $checked_categories = $_POST['checked_category'];

    //チェックされたカテゴリーが存在する場合、クエリで取得する値を絞る
    if (!empty($checked_categories)){
      $query = $select_all . intval($checked_categories[0]);
      for($i = 0; $i < count($checked_categories); $i++){
        if($i != 0){
          $query = $query . ' and category_id != ' . intval($checked_categories[$i]);
        }
      }
    }
    $stmt = $pdo->query($query);
    while ($row = $stmt->fetch()) {
      $topic[$fetch_count] = $row['topic'];
      $fetch_count++;
    }
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=UTF-8');
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