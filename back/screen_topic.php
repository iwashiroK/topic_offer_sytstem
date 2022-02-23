<?php

$dsn = 'mysql:dbname=hit;host=localhost;charset=utf8mb4';
$user = 'topicuser';
$password = 'sopPy6200';


//XSSスクリプティング対策用関数
function h($str)
{
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

$random_val = $_GET['random_val'];
//var_dump($random_val);


//ランダムなidのtopicを取りだす
$topic;

try{
  $pdo = new PDO($dsn, $user, $password , [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  $sql = 'select * from topic where id = :random_val ';
  $stm = $pdo->prepare($sql);
  $stm->bindValue(':random_val', h($random_val));
  $stm->execute();
  $result = $stm->fetch();

  $topic = $result["topic"];

  echo h($topic);

}catch (PDOException $e){
  print('Error:'.$e->getMessage());
  die();
}





?>
