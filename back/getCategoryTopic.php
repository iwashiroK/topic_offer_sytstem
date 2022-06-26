<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';

    $category = array();
    $max_id = array();
    $count = 0;
    $count_id = 0;
    $res = array(
      'category_topic' => [],
      'max_id' => [],
      'status' => '成功',
      'error' => ''
    );
    
    //カテゴリテーブルと話題テーブルを結合し、カテゴリに紐づく話題を取得する
    $stmt = $pdo->query('SELECT * FROM categorytable INNER JOIN topictable ON categorytable.category_id = topictable.category_id ORDER BY categorytable.category_id,topictable.id');
    while ($row = $stmt->fetch()) {
      $category[] = $row;
    }
    //category_idごとのidの最大値を取得する
    $stm = $pdo->query('SELECT max(id) AS max_id, category_id FROM topictable GROUP BY category_id ORDER BY category_id');
    while ($row = $stm->fetch()) {
      $max_id[] = $row;
    }

    $res['category_topic'] = $category;
    $res['max_id'] = $max_id;
  } catch (PDOException $e) {
    $res['erorr'] = $e->getMessage().PHP_EOL . $e->getMessage();
    $res['status'] = "失敗";
    exit;
  }
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  $pdo = null;
?>