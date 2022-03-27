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
    $query = '';
    $update_topic = [];
    $query_count = 0;
    $fetch_count = 0;
    $id = 0;
    $res = array(
      'status' => '成功',
      'error' => ''
    );
    //echo json_encode($res, JSON_UNESCAPED_UNICODE);

    
    header("Access-Control-Allow-Origin: *");
    //フロントからチェックされたカテゴリーを取得する
    $update_topic = $_POST;
    //echo json_encode($update_topic['category_id'], JSON_UNESCAPED_UNICODE);

    
    if (!empty($update_topic)){
      //すでに同じ話題が登録されていないかチェックする
      $stmt = $pdo->prepare('SELECT topic from topictable where topic = :topic');
      $stmt->bindValue(':topic', $update_topic['topic']);
      $stmt->execute();
      $topic_check = $stmt->fetch();
      
      //登録されている話題の場合、登録しない
      if(!empty($topic_check['topic'])){
        $res['status'] = "話題重複エラー";
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        return;
      }

      //現在登録されているカテゴリの最大idを取得する
      $stmt = $pdo->prepare('SELECT max(id) from topictable where category_id = :id');
      $stmt->bindValue(':id', intVal($update_topic['category_id']), PDO::PARAM_INT);
      $stmt->execute();
      $max_id = $stmt->fetch();
      //echo json_encode($max_id['max(id)'], JSON_UNESCAPED_UNICODE);

      // echo json_encode($id, JSON_UNESCAPED_UNICODE);
      // echo json_encode($update_topic['topic'], JSON_UNESCAPED_UNICODE);
      // echo json_encode($update_topic['category_id'], JSON_UNESCAPED_UNICODE);

      //画面から取得した話題を登録する
      $stmt = $pdo->prepare('INSERT INTO topictable values(:id, :category_id, :topic)');
      $stmt->bindValue(':id', intVal($max_id['max(id)']) + 1, PDO::PARAM_INT);
      $stmt->bindValue(':category_id', intVal($update_topic['category_id']), PDO::PARAM_INT);
      $stmt->bindValue(':topic', $update_topic['topic']);
      $stmt->execute();
      
    }
  } catch (PDOException $e) {
    $res['erorr'] = $e->getMessage().PHP_EOL . $e->getMessage();
    $res['status'] = "失敗";
    exit;
  }
  echo htmlspecialchars(json_encode($res, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8');
  $pdo = null;
?>