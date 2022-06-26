window.onload = $(function(){

  var category_topic_maxid = [];
  var category_topic_array = [];


  //登録ボタン押下時
  $('#btn_register').click(function(){
    //以前のエラーメッセージを削除
    $('#message').empty();

    //テキストボックスが空の場合
    if($('#register_category_text').val() == ""){
      $('#message').append("登録するカテゴリを入力してください");
      return;
    }

    if (confirm('登録しますか？')) {
      //登録処理
      //カテゴリ一覧を取得するajax通信を行う
      ajax_registerCategoryfunction($('#register_category_text').val());

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
      //カテゴリごとのidの最初と最後を判定するための変数
      var j = 0;
      var add_category_topic = '';
      var add_all = '';
      var topic_array = [];

      //パターン
      //カテゴリのみ登録されている
        //→クエリでtopictableからmax(id)として取得できていないので考慮不要
      //カテゴリと話題一つが登録されている
      //カテゴリと話題二つ以上が登録されている

      //カテゴリidの値のみが格納された配列を作成する
      var category_id_array = category_topic_array.map(item => item.category_id);
      //重複しないカテゴリが格納された配列を作成する
      var category_name_array = category_topic_array.map(item => item.category_name).filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });

      //カテゴリの数だけループさせる
      $.each(category_topic_maxid, function(index, value){
        console.log(index + ':' + value.category_id);

        //話題が入った配列のカテゴリidとループしているカテゴリidが合致する配列を作成する
        var topic_count = category_id_array.filter(element => element == value.category_id);

        //ループ中のカテゴリidと合致する話題を取得し、配列に格納する
        for(var k = 0; k < category_topic_array.length; k++){
          if(category_topic_array[k]['category_id'] == value.category_id){
            topic_array.push(category_topic_array[k]);
          }
        }

        //category_idに合致するidの数だけループする
        for(var i = 0; i < topic_count.length; i++){
          //登録されている話題が1つのみの場合
          if(j == 0 && value.max_id == topic_array[i]['id']){
            add_category_topic += '<li>' + topic_array[i]['category_name'] + '</li><ul><li>' + topic_array[i]['topic'] + '</li></ul>';
            add_all += add_category_topic;
            add_category_topic = '';
            topic_array = [];
            break;
          }
          //ループ処理の初めの場合
          else if(j == 0){
            add_category_topic += '<li>' + topic_array[i]['category_name'] + '</li><ul><li>' + topic_array[i]['topic'] + '</li>';
            j++;
          //カテゴリの最大idに合致した場合
          }else if(value.max_id == topic_array[i]['id']){
            add_category_topic += '<li>' + topic_array[i]['topic'] + '</li></ul>';
            j = 0;
            add_all += add_category_topic;
            add_category_topic = '';
            topic_array = [];
            break;
          }else{
            add_category_topic += '<li>' + topic_array[i]['topic'] + '</li>';
          }
        }
      })
      $('.square_category').append(add_all);
    });

    //カテゴリ選択メニューを表示または非表示にする
    $('#box_category').toggleClass('js_active');
  });


  //閉じるボタンクリック
  $('#btn_close').click(function(){

    //チェックボックス要素を削除する
    $('.square_category').empty();
    
    //カテゴリ選択メニューを表示または非表示にする
    $('#box_category').toggleClass('js_active');
  });
  

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
      category_topic_maxid = data.max_id;
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
  function ajax_registerCategoryfunction(category){
    console.log('ajax start');

    $.ajax({
      url: 'http://localhost/back/registerCategory.php',
      type: 'POST',
      data: {
        "category":category
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
