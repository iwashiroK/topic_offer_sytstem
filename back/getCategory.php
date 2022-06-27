<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';
    
    $stmt = $pdo->query('SELECT * from categorytable');
    $category = array();
    $count = 0;
    $res = array(
      'topic' => [],
      'error' => ''
    );

    while ($row = $stmt->fetch()) {
      $category[$count] = $row;
      $count++;
    }
    $res['topic'] = $category;
  } catch (Exception $e) {
    $res['error'] = $e->getMessage().PHP_EOL . "：" . $e->getMessage() . "：" . "失敗";
  }finally{
    echo json_encode($res, JSON_UNESCAPED_UNICODE);
    $pdo = null;
  }
?>