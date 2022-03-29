<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';

    $query = '';
    $checked_categories = [];
    $topic = [];
    $query_count = 0;
    $fetch_count = 0;
    $res = array(
      'topic' => [],
      'error' => ''
    );

    header('Content-Type: application/json; charset=UTF-8');
    //フロントからチェックされたカテゴリーを取得する
    $checked_categories = $_POST['checked_category'];
    
    //チェックされたカテゴリーが存在する場合、クエリで取得する値を絞る
    if (!empty($checked_categories)){
      $stmt = $pdo->prepare('SELECT * from topictable where category_id != :category_id');
      $query = intVal($checked_categories[0]);
      for($i = 0; $i < count($checked_categories); $i++){
        if($i != 0){
          $query = $query . ' and category_id != ' . intval($checked_categories[$i]);
        }
      }
      $stmt->bindValue(':category_id', $query);
      $stmt->execute();
      while ($row = $stmt->fetch()) {
        $topic[$fetch_count] = $row['topic'];
        $fetch_count++;
      }
    }
    $res['topic'] = $topic;
  } catch (PDOException $e) {
    $res['error'] = $e->getMessage().PHP_EOL . "：" . $e->getMessage() . "：" . "失敗";
    exit;
  }
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  $pdo = null;
?>