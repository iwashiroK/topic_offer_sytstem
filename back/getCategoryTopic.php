<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';

    $category = array();
    $count = 0;   
    $res = array(
      'category_topic' => [],
      'status' => '成功',
      'error' => ''
    );
    
    //カテゴリテーブルと話題テーブルを結合し、カテゴリに紐づく話題を取得する
    $stmt = $pdo->query('SELECT * FROM categorytable INNER JOIN topictable ON categorytable.category_id = topictable.category_id order BY categorytable.category_id,topictable.id');
    while ($row = $stmt->fetch()) {
      $category[$count] = $row;
      $count++;
    }
    $res['category_topic'] = $category;
  } catch (PDOException $e) {
    $res['erorr'] = $e->getMessage().PHP_EOL . $e->getMessage();
    $res['status'] = "失敗";
    exit;
  }
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  $pdo = null;
?>