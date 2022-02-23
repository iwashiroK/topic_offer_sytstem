<!DOCTYPE html>
<html>
<head>
<meta charset=UTF-8">
<title>MariaDBへの接続テスト</title>
</head>
<body>

<?php

$dsn = 'mysql:dbname=staff;host=localhost';
$user = 'testuser';
$password = 'sopPy6200';

try{
    $dbh = new PDO($dsn, $user, $password);

    $sql = 'select * from staffname';
    foreach ($dbh->query($sql) as $row) {
        print($row['id'].',');
        print($row['name']);
        print('<br />');
    }
}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}

$dbh = null;

?>

</body>
</html>
