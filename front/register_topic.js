window.onload = $(function(){

  var category_array = [];
  var category_topic_array = [];

  //カテゴリ一覧を取得するajax通信を行う
  //ajax関数のリターン値としてDeferredオブジェクトを受け取る
  var deferred = ajax_getCategoryFunction();

  deferred.promise().then(function(){
    category_array.forEach(element => {
      var add_category = '<option value="' + element['category_id'] + '">' + element['category_name'] + '</option><br>';
      //<option value="選択肢1">選択肢1</option>
      $('#category').append(add_category);
    });
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
      //カテゴリ一覧を取得するajax通信を行う
      ajax_updateTopicfunction($('#category').val(), $('#register_topic_text').val());

    }else{
      return;
    }
  });

  //戻るボタン押下時
  $('#btn_back').click(function(){
    window.location.href = "./screen.html";
  });


  //カテゴリ話題一覧取得ボタンクリック
  $('.btn_catgory_topic').click(function(){
    //カテゴリ一覧を取得するajax通信を行う
    //ajax関数のリターン値としてDeferredオブジェクトを受け取る
    var deferred = ajax_getCategoryTopicFunction();
    
    deferred.promise().then(function(){
      var i = 0;
      var j = 0;
      var add_category_topic = '';

      //取得したカテゴリ/話題配列一要素単位でループする
      category_topic_array.forEach(element => {
        if(element['category_id'] == i){
          //初めのループのみカテゴリ要素追加
          if(j == 0){
            add_category_topic += '<li>' + element['category_name'] + '</li><ul>';
            j++;
          }
          //話題要素追加
          add_category_topic += '<li>' + element['topic'] + '</li>';
        }else{
          j = 0;
          i++;
          if(j == 0){
            add_category_topic += '</ul>';
          }
        }
      });
      $('.square_category').append(add_category_topic);
    });

    //カテゴリ選択メニューを表示または非表示にする
    $('#box_category').toggleClass('js_active');
  });


  //確定して閉じるボタンクリック
  $('#btn_close').click(function(){

    //チェックボックス要素を削除する
    $('.square_category').empty();
    
    //カテゴリ選択メニューを表示または非表示にする
    $('#box_category').toggleClass('js_active');
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
      category_array = data.topic;
      console.log(category_array);
      console.log(data.error);
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

  //カテゴリ一覧取得ajax通信を行う
  function ajax_getCategoryTopicFunction(){
    console.log('ajax start');
    //完了を知らせるためにDeferredオブジェクトを生成しそれを返す
    var deferred = new $.Deferred();

    //話題を取得する
    $.ajax({
      url: "http://localhost/back/getCategoryTopic.php",
      type: "GET",
      //data: {
        //"random_val":random,
      //},
      dataType : "json",
      timespan:1000
    }).done(function(data){
      category_topic_array = data.category_topic;
      console.log(category_topic_array);
      console.log(data.error);
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

  //カテゴリが絞られた後の話題取得時にajax通信を行う
  function ajax_updateTopicfunction(category_id, topic){
    console.log('ajax start');

    $.ajax({
      url: 'http://localhost/back/updateTopic.php',
      type: 'POST',
      data: {
        "category_id":category_id,
        "topic":topic,
      },
      //dataType : 'text',
      dataType : 'json',
      timespan:1000
    }).done(function(data){
      console.log(data);
      console.log(data.error);
      switch(data.status){
        case "成功" :
          $('#message').append("話題の登録に成功しました");
        break;
        case "失敗" :
          $('#message').append("話題の登録に失敗しました");
        break;
        case "話題重複エラー" :
          $('#message').append("話題が重複しています");
        break;
      }
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus : " + textStatus);
      console.log("errorThrown : " + errorThrown.message);
    }).always(function(){
      console.log('ajax finish');
    });
  }

});
