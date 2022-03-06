window.onload = $(function(){
  var data_max_count = 0;
  var randoms = [];
  var topic_array = [];
  var category_array = [];
  var filter_category_array = [];
  var btn_count = 0;
  
  //初期表示処理
  //ajax関数のリターン値としてDeferredオブジェクトを受け取る
  var deferredInit = ajax_initfunction();

  deferredInit.promise().then(function(){
    console.log("ランダム"+Date.now());
    createRandom(data_max_count-1);
    console.log(randoms);
  });
  
  
  
  //次へボタンクリック
  $('#btn_next').click(function(){
    
    //格納された配列の乱数のお題を取得する
    $('.odai_in').html(topic_array[randoms[btn_count]]);

    //ボタンをクリックした回数
    btn_count++;
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

    //カテゴリ選択メニューを切り替える
    $('#box_category').toggle();
  });


  //確定して閉じるボタンクリック
  $('#btn_confirm').click(function(){
    var checked_category = [];

    //チェックされたカテゴリーのvalueを取得して配列に格納する
    $(':checkbox[class="category_check"]:checked').each(function () {
      checked_category.push(Number($(this).val()));
    });
    console.log(checked_category);

    //選択されたカテゴリの話題を取得しないajax通信
    //ajax関数のリターン値としてDeferredオブジェクトを受け取る
    var deferred = ajax_filterCategoryfunction(checked_category);

    deferred.promise().then(function(){
      if(data_max_count != 0){
        //絞ったデータ数で再度ランダム数字作成
        console.log(data_max_count);
        createRandom(data_max_count-1);
      }
    });
    //チェックボックス要素を削除する
    $('.square_category').empty();
    //カテゴリ選択メニューを切り替える
    $('#box_category').toggle();
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

  //for2回の中にifで分岐させているため処理が重い
  // function createRandom(data_max_count){
  //   for(i = 0; i <= data_max_count; i++){
    //     while(true){
      //       var tmp = intRandom(0, data_max_count);
  //       if(!randoms.includes(tmp)){
    //         randoms.push(tmp);
    //         break;
    //       }
    //     }
    //   }
    // }
    // //minからmaxの間での乱数作成
    // function intRandom(min, max){
      //   return Math.floor( Math.random() * (max - min + 1)) + min;
      // }


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
          topic_array = data;
          data_max_count = topic_array.length;
          console.log(topic_array);
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

      data_max_count = data.length;
      if(data_max_count == 0){
        topic_array.length = 0;
        $('.odai_in').html("データがありません。");
      }else{
        topic_array = data;
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
