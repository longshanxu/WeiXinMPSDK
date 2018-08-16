/**
 * @description 增加知识点
 * @author liangwei.xia
 * @since 2018-1-11
 */


function Getjingcaidata(element) {
  //console.log(element);
  return new Promise(function (resolve, reject) {
    var Score = Parse
      .Object
      .extend("Socre");
    var score = new Parse.Query(Score);
    var mactchid = element;
    score.equalTo("match_id", element);
    score.find({
      success: function (datas) {
        //console.log(count++); Do something with the returned Parse.Object values
        for (var i = 0; i < datas.length; i++) {
          var object = datas[i];
          //console.log(object.id);
          var item = object.get('info');
          var match_time = object.get('match_time');
          var serial_no = object.get('serial_no');

          var temparray = {};

          for (let j = 0; j < item.length; j++) {
            const e = item[j];

            if (e.provider_id == "14" && e.provider_name == "威廉希尔") {
              //初始 - 胜/平/负 初始 - 胜/平/负
              var h = e.start.home;
              var d = e.start.draw;
              var a = e.start.away;
              //最新 - 胜/平/负
              var h1 = e.end.home;
              var d1 = e.end.draw;
              var a1 = e.end.away;
              var rrr = h + "-" + d + "-" + a + "-" + h1 + "-" + d1 + "-" + a1;

              temparray['weilian'] = rrr;

            }

            if (e.provider_id == "43" && e.provider_name == "interwetten") {
              //初始 - 胜/平/负 初始 - 胜/平/负
              var h = e.start.home;
              var d = e.start.draw;
              var a = e.start.away;
              //最新 - 胜/平/负
              var h1 = e.end.home;
              var d1 = e.end.draw;
              var a1 = e.end.away;
              var rrr = h + "-" + d + "-" + a + "-" + h1 + "-" + d1 + "-" + a1;
              temparray['interwetten'] = rrr;
            }

            if (e.provider_id == "35" && e.provider_name == "易胜博") {
              //初始 - 胜/平/负 初始 - 胜/平/负
              var h = e.start.home;
              var d = e.start.draw;
              var a = e.start.away;
              //最新 - 胜/平/负
              var h1 = e.end.home;
              var d1 = e.end.draw;
              var a1 = e.end.away;
              var rrr = h + "-" + d + "-" + a + "-" + h1 + "-" + d1 + "-" + a1;
              temparray['yishengbo'] = rrr;

            }

          }
          temparray["id"] = mactchid;
          temparray["match_time"] = match_time;
          temparray["serial_no"] = serial_no;

          // results.push(temparray);
          resolve(temparray);
        }

      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
        reject(error)
      }

    });

  });
}

function Getyinglidata(element) {
  //console.log(element);
  return new Promise(function (resolve, reject) {
    var Bet = Parse
      .Object
      .extend("Bet");

    var bet = new Parse.Query(Bet);

    bet.equalTo("match_id", element);

   
    bet.find({
      success: function (datas) {
        //console.log(count++); Do something with the returned Parse.Object values
        var rrr = "";
        var id = "";
        for (var i = 0; i < datas.length; i++) {

          //循环盈利的数据
          var object = datas[i];
          //console.log(object.id);
          var item = object.get('info');
          id = object.get('match_id');
          var h = item.jcTrade.WinLost.home;
          var d = item.jcTrade.WinLost.draw;
          var a = item.jcTrade.WinLost.away;

          rrr = h + ";" + d + ";" + a+"&"+id;

          resolve(rrr);
        }


      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
        reject(error);
      }

    });
  });

};


function getdata1(array, resultssss,datetemp) {
  if (array.length > 0) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      Getjingcaidata(element).then(function (data) {
        resultssss.push(data);
        if (resultssss.length == array.length) {
          for (let i = 0; i < array.length; i++) {
            const item = array[i];
            Getyinglidata(item).then(function(datas){
                //console.log("---dat"+datas)
                var tt = datas.split("&");
                for (let j = 0; j < resultssss.length; j++) {
                  const jitem = resultssss[j];
                  if (jitem.id == tt[1]) {
                    //jitem["yingli"] = tt[0];
                   
                    var Result = Parse
                      .Object
                      .extend("Result");
                    var r = new Result();
              
                    r.set("match_id", jitem.id);
                    r.set("interwetten", jitem.interwetten);
                    r.set("weilian", jitem.weilian);
                    r.set("yishengbo", jitem.yishengbo);
                    r.set("yingli", tt[0]);
                    r.set("match_time", jitem.match_time);
                    r.set("today",datetemp);
                    r.set("serial_no", jitem.serial_no);
                    r.save();  
                  }

                }
                
               
            });
          }

          //console.log(resultssss);
        }
      });
    }
  }
}

Parse
  .Cloud
  .define("GetRowData", (request, response) => {
    var GameScore = Parse
      .Object
      .extend("GameScore");
    var query = new Parse.Query(GameScore);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }
    query.equalTo("date", datetemp);
    var array = [];
    var resultssss = [];
    query.find({
      success: function (results) {

        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var item = object.get('data');
          //获取data的数据
          var x = item[datetemp];
          for (var key in x) {
            var match_id = x[key]["match_id"];
            //查询三大数据，
            array.push(match_id);
          }
        }

        getdata1(array, resultssss,datetemp);

        response.success("OK");
      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });

  });



  /*************
   * 
   * GetRowData
   * 获取专用数据
   * 
   * ***************/
  