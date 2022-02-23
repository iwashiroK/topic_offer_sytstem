window.onload = $(function(){
  var max_init = 0;
  var data_max_count = 0;
  var randoms = [];
  var random;
  var topic_array = [];
  var btn_count = 0;

  /** 話題の最大値を取得する */
  // $.ajax({
  //     url: "./screen.php",
  //     type: "GET",
  //     data: {
  //       "max" : "max_init",
  //     },
  //     dataType : "text",
  //     timespan:1000
  //   }).done(function(data){
  //     max_val = data;
  //     console.log(max_val);

  //     /** 最小値と最大値 */
  //     var min = 1, max = max_val;

  //     /** 重複チェックしながら乱数作成 */
  //     for(i = min; i <= max; i++){
  //       while(true){
  //         var tmp = intRandom(min, max);
  //         if(!randoms.includes(tmp)){
  //           randoms.push(tmp);
  //           break;
  //         }
  //       }
  //     }

  //     /** min以上max以下の整数値の乱数を返す */
  //     function intRandom(min, max){
  //       return Math.floor(Math.random() * (max - min + 1)) + min;
  //     }

  //     i = -1;


  //   }).fail(function(XMLHttpRequest, textStatus, errorThrown){
  //     console.log("XMLHttpRequest : " + XMLHttpRequest.status);
  // 　　console.log("textStatus : " + textStatus);
  // 　　console.log("errorThrown : " + errorThrown.message);
  //   });

  
  //setTimeout(createRandom(data_max_count), 5000);

  //ajax関数のリターン値としてDeferredオブジェクトを受け取る
  var deferred = ajax_function();

  deferred.promise().then(function(){
    console.log("ランダム"+Date.now());
    createRandom(data_max_count-1);
    console.log(randoms);
  });
  
  
  
  //次へボタンクリック
  $('#btn').click(function(){
    
    //格納された配列の乱数のお題を取得する
    $('.odai_in').html(topic_array[randoms[btn_count]]);

    //ボタンをクリックした回数
    btn_count++;
    
    //random = randoms[i];
  });
  
  //ajax通信を行う
  function ajax_function(){
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
      console.log(data);
      topic_array = data;
      data_max_count = data.length;
      console.log(topic_array);
      console.log(data_max_count);
      console.log("ajax done"+Date.now());
    }).fail(function(XMLHttpRequest, textStatus, errorThrown){
      console.log("XMLHttpRequest : " + XMLHttpRequest.status);
      console.log("textStatus : " + textStatus);
      console.log("errorThrown : " + errorThrown.message);
    }).always(function(){
      console.log('ajax finish');
      console.log("ajax fin"+Date.now());
      //ajax処理を終了したことをDeferredオブジェクトに通知
      deferred.resolve();
    });
    //完了を知らせるためにDeferredオブジェクトを生成しそれを返す
    return deferred;
  }

  //重複しない乱数作成
  function createRandom(data_max_count){
    for(i = 0; i <= data_max_count; i++){
      while(true){
        var tmp = intRandom(0, data_max_count);
        if(!randoms.includes(tmp)){
          randoms.push(tmp);
          break;
        }
      }
    }
  }
  //minからmaxの間での乱数作成
  function intRandom(min, max){
    return Math.floor( Math.random() * (max - min + 1)) + min;
  }

});
