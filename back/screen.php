<?php
  header("Access-Control-Allow-Origin: *");
  
  try{
    //db接続ファイルを読み込む
    require_once dirname(__FILE__) . '/dbinfo/dbConnect.php';

    $topic = [];
    $fetch_count = 0;
    $res = array(
      'topic' => [],
      'error' => ''
    );

    $stmt = $pdo->query('SELECT * from topictable');
    while ($row = $stmt->fetch()) {
      $topic[$fetch_count] = $row['topic'];
      $fetch_count++;
    }
    //echo $topic;
    $res['topic'] = $topic;
  } catch (PDOException $e) {
    $res['error'] = $e->getMessage().PHP_EOL . "：" . $e->getMessage() . "：" . "失敗";
    exit;
  }
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  $pdo = null;
?>