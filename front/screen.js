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
  }).fail(function(XMLHttpRequest, textStatus, errorThrown){
    console.log("XMLHttpRequest : " + XMLHttpRequest.status);
    console.log("textStatus : " + textStatus);
    console.log("errorThrown : " + errorThrown.message);
  });

  setTimeout(createRandom(data_max_count), 5000);

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

  function intRandom(min, max){
    return Math.floor( Math.random() * (max - min + 1)) + min;
  }
  console.log(randoms);

  //次へボタンクリック
  $('#btn').click(function(){
    //ボタンをクリックした回数
    btn_count++;
    
    $('.odai_in').html(topic_array[btn_count-1]);
    
    //random = randoms[i];
  });
    


});
