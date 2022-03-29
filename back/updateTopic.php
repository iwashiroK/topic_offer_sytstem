<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';

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

    header('Content-Type: application/json; charset=UTF-8');
    //フロントからチェックされたカテゴリーを取得する
    $update_topic = $_POST;
    //echo json_encode($update_topic['category_id'], JSON_UNESCAPED_UNICODE);

    
    if (!empty($update_topic)){
      //すでに同じ話題が登録されていないかチェックする
      $stmt = $pdo->prepare('SELECT topic from topictable where topic = :topic');
      $stmt->bindValue(':topic', htmlspecialchars($update_topic['topic'], ENT_QUOTES, 'UTF-8'));
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
      $stmt->bindValue(':topic', htmlspecialchars($update_topic['topic'], ENT_QUOTES, 'UTF-8'));
      $stmt->execute();
      
    }
  } catch (PDOException $e) {
    $res['erorr'] = $e->getMessage().PHP_EOL . $e->getMessage();
    $res['status'] = "失敗";
    exit;
  }
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  $pdo = null;
?>