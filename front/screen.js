window.onload = $(function(){
  var data_max_count = 0;
  var randoms = [];
  var topic_array = [];
  var category_array = [];
  var next_btn_count = -1;
  
  //初期表示処理
  //ajax関数のリターン値としてDeferredオブジェクトを受け取る
  var deferredInit = ajax_initfunction();

  deferredInit.promise().then(function(){
    console.log("ランダム"+Date.now());
    createRandom(data_max_count);
    console.log(randoms);
  });
  

  //話題を登録するボタン押下時、画面遷移する
  $('#btn_register_topic').click(function(){
    window.location.href = "./register_topic.html";
  });

  //初期状態で戻るボタンは非活性にしておく
  $("#btn_back").prop("disabled", true);

  //次へボタン押下
  $('#btn_next').click(function(){

    //次へボタンをクリックした回数
    next_btn_count++;
    console.log(next_btn_count);
    
    //格納された配列の乱数のお題を取得する
    $('.odai_in').html(topic_array[randoms[next_btn_count]]);

    //次へボタンを押下した場合、戻るボタンを活性化
    if(next_btn_count != -1){
      $("#btn_back").prop("disabled", false);
    }

    //次へボタン押下回数が話題配列の最大要素数に達した場合
    if(next_btn_count + 1 == topic_array.length){
      //次へボタン非活性化
      $("#btn_next").prop("disabled", true);
    }
  });


  //戻るボタン押下
  $('#btn_back').click(function(){
    
    //戻るボタンをクリックした回数
    next_btn_count--;
    console.log(next_btn_count);
    
    //格納された配列の乱数のお題を取得する
    $('.odai_in').html(topic_array[randoms[next_btn_count]]);

    //戻るボタン押下時に
    if(next_btn_count == 0 || next_btn_count == -1){
      $("#btn_back").prop("disabled", true);
    }

    //話題配列の最大要素数に達した時に活性化した次へボタンを、戻るボタンを押下した時に、活性化させる
    if(next_btn_count == topic_array.length-2){
      $("#btn_next").prop("disabled", false);
    }
  });


  //カテゴリ選択ボタンクリック
  $('.btn_category').click(function(){
    //カテゴリ一覧を取得するajax通信を行う
    //ajax関数のリターン値としてDeferredオブジェクトを受け取る
    var deferred = ajax_getCategoryFunction();

    deferred.promise().then(function(){
      category_array.forEach(element => {
        var add_category = '<input type="checkbox" class="category_check" value="' + element['category_id'] + '">' + element['category_name'] + '<br>';
        $('.square_category').append(add_category);
      });
      console.log(randoms);
    });

    //カテゴリ選択メニューを表示または非表示にする
    $('#box_category').toggleClass('js_active');
  });


  //確定して閉じるボタンクリック
  $('#btn_confirm').click(function(){
    var checked_category = [];

    //チェックされたカテゴリーのvalueを取得して配列に格納する
    $(':checkbox[class="category_check"]:checked').each(function () {
      checked_category.push(Number($(this).val()));
    });
    console.log(checked_category);

    //カテゴリ選択にチェックがない場合、話題をすべて取得する
    if(checked_category.length == 0){
      ajax_getCategoryFunction();
    }else{
      //選択されたカテゴリの話題を取得しないajax通信
      //ajax関数のリターン値としてDeferredオブジェクトを受け取る
      var deferred = ajax_filterCategoryfunction(checked_category);
  
      deferred.promise().then(function(){
        //絞ったデータ数で再度ランダム数字作成
        console.log(data_max_count);
        createRandom(data_max_count);
        console.log(randoms);
      });

    }
    
    //次へをクリックした回数をリセット
    next_btn_count = -1;
    //チェックボックス要素を削除する
    $('.square_category').empty();
    //カテゴリ選択メニューを表示または非表示にする
    $('#box_category').toggleClass('js_active');
  });



  
  
  //重複しない乱数作成
  function createRandom(data_max_count) {
    //0から要素数の配列作成
    const arr = [...Array(data_max_count)].map((_, i) => i);
    var n = arr.length;
    var temp, i;

    //上記配列の中身をシャッフル
    while (n > 0) {
      i = Math.floor(Math.random() * n--);
        temp = arr[n];
        arr[n] = arr[i];
        arr[i] = temp;
      }
    randoms = arr;
  }

  //初期表示ajax通信を行う
  function ajax_initfunction(){
    console.log('ajax start');
    //完了を知らせるためにDeferredオブジェクトを生成しそれを返す
    var deferred = new $.Deferred();

    //話題を取得する
    $.ajax({
      url: "http://localhost/back/screen.php",
      type: "GET",
      //data: {
        //"random_val":random,
      //},
      dataType : "json",
      timespan:1000
    }).done(function(data){
      //条件で絞った話題で上書きする
      topic_array = data.topic;
      data_max_count = topic_array.length;
      console.log(data);
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
      console.log(data);
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
  function ajax_filterCategoryfunction(checked_category){
    console.log('ajax start');
    //完了を知らせるためにDeferredオブジェクトを生成しそれを返す
    var deferred = new $.Deferred();

    $.ajax({
      url: 'http://localhost/back/filterCategory.php',
      type: 'POST',
      data: {
        "checked_category":checked_category,
      },
      //dataType : 'text',
      dataType : 'json',
      timespan:1000
    }).done(function(data){
      topic_array = data.topic;
      data_max_count = data.topic.length;
      if(data_max_count == 0){
        topic_array.length = 0;
        $('.odai_in').html("データがありません。");
      }else{
        topic_array = data.topic;
      }
      console.log(data);
      console.log(data_max_count);
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
