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
    $sql = 'SELECT * from topictable where category_id != :category_id';
    $sql_add = ' and category_id != :category_id';

    header('Content-Type: application/json; charset=UTF-8');
    //フロントからチェックされたカテゴリーを取得する
    $checked_categories = $_POST['checked_category'];
    
    //チェックされたカテゴリーが存在する場合、クエリで取得する値を絞る
    if (!empty($checked_categories)){
      if(count($checked_categories) == 1){
        $stmt = $pdo->prepare($sql);
        $query = intVal($checked_categories[0]);
        $stmt->bindValue(':category_id', $query, PDO::PARAM_INT);
      }else if(count($checked_categories) > 1){
        for($i = 1; $i < count($checked_categories); $i++){
          $sql = $sql . $sql_add . strval($i);
        }
        $stmt = $pdo->prepare($sql);
        for($i = 0; $i < count($checked_categories); $i++){
          if($i == 0){
            $stmt->bindValue(':category_id', $checked_categories[$i], PDO::PARAM_INT);  
          }else{
            $stmt->bindValue(':category_id'.strval($i), $checked_categories[$i], PDO::PARAM_INT);
          }
        }
      }
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