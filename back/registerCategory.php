<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';

    $register_category = [];
    $res = array(
      'status' => '成功',
      'error' => ''
    );

    header('Content-Type: application/json; charset=UTF-8');
    //フロントからチェックされたカテゴリーを取得する
    $register_category = $_POST;

    if (!empty($register_category)){
      //すでに同じ話題が登録されていないかチェックする
      $stmt = $pdo->prepare('SELECT category_name from categorytable where category_name = :category');
      $stmt->bindValue(':category', htmlspecialchars($register_category['category'], ENT_QUOTES, 'UTF-8'));
      $stmt->execute();
      $topic_check = $stmt->fetch();
      
      //登録されている話題の場合、登録しない
      if(!empty($topic_check['category_name'])){
        $res['status'] = "話題重複エラー";
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        return;
      }

      //現在登録されているカテゴリの最大idを取得する
      $stmt = $pdo->query('SELECT max(category_id) from categorytable');
      $max_id = $stmt->fetch();

      //画面から取得した話題を登録する
      $stmt = $pdo->prepare('INSERT INTO categorytable values(:category_id, :category)');
      $stmt->bindValue(':category_id', intVal($max_id['max(category_id)']) + 1, PDO::PARAM_INT);
      $stmt->bindValue(':category', htmlspecialchars($register_category['category'], ENT_QUOTES, 'UTF-8'));
      $stmt->execute();
      
    }
  } catch (Exception $e) {
    $res['error'] = $e->getMessage().PHP_EOL . $e->getMessage();
    $res['status'] = "失敗";
    exit;
  }
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  $pdo = null;
?>