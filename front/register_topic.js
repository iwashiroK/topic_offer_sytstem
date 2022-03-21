window.onload = $(function(){

  //カテゴリ一覧を取得するajax通信を行う
  //ajax関数のリターン値としてDeferredオブジェクトを受け取る
  var deferred = ajax_getCategoryFunction();

  deferred.promise().then(function(){
    category_array.forEach(element => {
      var add_category = '<option value="' + element['category_id'] + '">' + element['category_name'] + '</option><br>';
      //<option value="選択肢1">選択肢1</option>
      $('#category').append(add_category);
    });
    console.log(randoms);
  });


  //登録ボタン押下時
  $('#btn_register').click(function(){
    //以前のエラーメッセージを削除
    $('#message').empty();

    //プルダウン未選択時
    if($('#category').val() == ""){
      $('#message').append("カテゴリを選択してください");
      return;
    }

    //テキストボックスが空の場合
    if($('#register_topic_text').val() == ""){
      $('#message').append("登録する話題を入力してください");
      return;
    }

    if (confirm('登録しますか？')) {
      //登録処理
    }else{
      return;
    }
  });

  //戻るボタン押下時
  $('#btn_back').click(function(){
    window.location.href = "./screen.html";
  });





  //カテゴリ一覧取得ajax通信を行う
  function ajax_getCategoryFunction(){
    console.log('ajax start');
    //完了を知らせるためにDeferredオブジェクトを生成しそれを返す
    var deferred = new $.Deferred();

    //話題を取得する
    $.ajax({
      url: "http://localhost/back/getCategory.php",
      type: "GET",
      //data: {
        //"random_val":random,
      //},
      dataType : "json",
      timespan:1000
    }).done(function(data){
      category_array = data;
      console.log(category_array);
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus : " + textStatus);
      console.log("errorThrown : " + errorThrown.message);
    }).always(function(){
      console.log('ajax finish');
      //ajax処理を終了したことをDeferredオブジェクトに通知
      deferred.resolve();
    });
    //完了を知らせるためにDeferredオブジェクトを生成しそれを返す
    return deferred;
  }

});
