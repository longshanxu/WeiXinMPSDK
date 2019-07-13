/**
 * 
 * @description 
 * @author Json.xu
 * @since 2018-1-11
 * 
 */

//bet 数据 https://mobile.288365.com/#type=Splash;key=1;ip=0;lng=2 获取今天的比赛
Parse
  .Cloud
  .define("getgamebytoday", (request, response) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }

    datetemp = "2019-07-13";;

    Parse
      .Cloud
      .httpRequest({
        url: 'https://apic.itou.com/api/match/selectlist?platform=koudai_mobile&_prt=https&ver' +
            '=20180101000000&hide_more=1',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      })
      .then(function (httpResponse) {
        // success console.log(httpResponse.data);
        var GameScore = Parse
          .Object
          .extend("GameScore");
        var gameScore = new GameScore();
        //console.log(httpResponse.data);
        gameScore.set("date", datetemp);
        gameScore.save(httpResponse.data);

        response.success({"code": "200"});

      }, function (httpResponse) {
        // error
        response.error('Request failed with response code ' + httpResponse.status);
      });

  })

//
Parse
  .Cloud
  .define("getbisai", (request, response) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }

    datetemp = "2019-07-13";;
    //https://vipc.cn/i/live/jczq/date/2019-07-13/next
    Parse
      .Cloud
      .httpRequest({
        url: 'https://vipc.cn/i/live/jczq/date/' + datetemp + '/next',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Accept-Encoding': 'gzip,deflate, br'
        },
        gzip: true
      })
      .then(function (httpResponse) {
        // success console.log(httpResponse.data);
        var GameScore = Parse
          .Object
          .extend("Game2");
        var gameScore = new GameScore();
        //console.log(httpResponse.data);
        gameScore.set("date", datetemp);
        gameScore.save(httpResponse.data);
        // console.log(httpResponse.data);
        response.success({"code": "200"});

      }, function (httpResponse) {
        // error
        response.error('Request failed with response code ' + httpResponse.status);
      });

  })

Parse
  .Cloud
  .define("getpeilvdata2", (request, response) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }

    //定义某天的时间;;
    datetemp = "2019-07-13";

    var GameScore = Parse
      .Object
      .extend("Game2");

    var query = new Parse.Query(GameScore);

    query.equalTo("date", datetemp);
    query.limit(500);

    query.find({
      success: function (results) {

        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var items = object.get("items");
          for (let j = 0; j < items.length; j++) {
            const element = items[j];
            if (element.dateDesc == "今天") {
              var macthes = element.matches;
              for (let x = 0; x < macthes.length; x++) {
                const element = macthes[x];
                if (GetjingcaiID(element)) {
                  var match_id = element.model.matchId;
                  var match_time = element.model.matchTime;
                  var league = element.model.league;
                  var jingcaiId = element.model.jingcaiId;
                  getdata2(match_id, match_time, league, jingcaiId, datetemp);
                }

              }

            }

          }
        }
        response.success("OK");

      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });

  });
function getdata2(match_id, match_time, league, jingcaiId, datetemp) {
  //console.log(match_id);
  var url = "https://vipc.cn/i/match/football/" + match_id + "/odds/euro";

  Parse
    .Cloud
    .httpRequest({
      url: url,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate, br'
      },
      gzip: true
    })
    .then(function (httpResponse) {
      //console.log(httpResponse.data);
      var Score = Parse
        .Object
        .extend("Socre2");
      var score = new Score();
      score.set("match_id", match_id);
      score.set("match_time", match_time);
      score.set("today", datetemp);
      score.set("league", league);
      score.set("jingcaiId", jingcaiId);
      score.save(httpResponse.data);

    }, function (httpResponse) {
      // error
      response.error('Request failed with response code ' + httpResponse.status);
    });

}

Parse
  .Cloud
  .define("getbet2", (request, response) => {

    var GameScore = Parse
      .Object
      .extend("Game2");

    var query = new Parse.Query(GameScore);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }

    datetemp = "2019-07-13";;

    query.equalTo("date", datetemp);
    query.limit(500);

    query.find({
      success: function (results) {

        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var items = object.get("items");
          for (let j = 0; j < items.length; j++) {
            const element = items[j];
            if (element.dateDesc == "今天") {
              var macthes = element.matches;
              for (let x = 0; x < macthes.length; x++) {
                const element = macthes[x];
                if (GetjingcaiID(element)) {
                  var match_id = element.model.matchId;
                  var match_time = element.model.matchTime;
                  var league = element.model.league;
                  var jingcaiId = element.model.jingcaiId;
                  Getbetdata2(match_id, match_time, league, jingcaiId, datetemp);
                }

              }

            }

          }
        }
        response.success("OK");
      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  });

function Getbetdata2(match_id, match_time, league, jingcaiId, datetemp) {
  //console.log(match_id);
  var url = "https://vipc.cn/i/match/football/" + match_id + "/sporttery";

  Parse
    .Cloud
    .httpRequest({
      url: url,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate, br'
      },
      gzip: true
    })
    .then(function (httpResponse) {
      // success console.log(httpResponse.data);
      var Bet = Parse
        .Object
        .extend("Bet2");
      var bet = new Bet();

      bet.set("match_id", match_id);
      bet.set("match_time", match_time);
      bet.set("league", league);
      bet.set("jingcaiId", jingcaiId);
      bet.set("today", datetemp);
      bet.save(httpResponse.data);

    }, function (httpResponse) {
      // error
      response.error('Request failed with response code ' + httpResponse.status);
    });

}

Parse
  .Cloud
  .define("getrowdata2", (request, response) => {
    var GameScore = Parse
      .Object
      .extend("Game2");
    var query = new Parse.Query(GameScore);
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }
    datetemp = "2019-07-13";;
    query.equalTo("date", datetemp);
    query.limit(500);
    var array = [];
    var resultssss = [];
    query.find({
      success: function (results) {

        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          const element = results[i];
          if (element.get("date") == datetemp) {
            var object = results[i];
            var items = object.get("items");
            for (let j = 0; j < items.length; j++) {
              const item = items[j];
              if (item.dateDesc == "今天") {
                var macthes = item.matches;

                for (let x = 0; x < macthes.length; x++) {

                  const element = macthes[x];
                  if (GetjingcaiID(element)) {
                    var match_id = element.model.matchId;
                    array.push(match_id);
                  }
                }
              }
            } //查询三大数据，
          }
        }

        if (array.length > 0) {

          getdata3(array, resultssss, datetemp);

        }

        response.success("OK");
      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });

  });

function getdata3(array, resultssss, datetemp) {
  if (array.length > 0) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      //console.log(element);
      Getjingcaidata2(element).then(function (data) {
        resultssss.push(data);
        //console.log(resultssss.length + "----"+ array.length);
        if (resultssss.length == array.length) {
          for (let i = 0; i < array.length; i++) {
            const item = array[i];
            Getyinglidata2(item).then(function (datas) {
              //console.log("---dat"+datas)
              var tt = datas.split("&");
              for (let j = 0; j < resultssss.length; j++) {
                const jitem = resultssss[j];
                if (jitem.id == tt[1]) {
                  //jitem["yingli"] = tt[0];

                  var Result = Parse
                    .Object
                    .extend("Result2");
                  var r = new Result();

                  r.set("match_id", jitem.id);
                  r.set("interwetten", jitem.interwetten);
                  r.set("weilian", jitem.weilian);
                  r.set("yishengbo", jitem.yishengbo);
                  r.set("yingli", tt[0]);
                  r.set("guanfang", jitem.guanfang);
                  r.set("bet365", jitem.bet365);
                  r.set("match_time", jitem.match_time);
                  r.set("today", datetemp);
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

function Getjingcaidata2(element) {
  //console.log("--"+element);
  return new Promise(function (resolve, reject) {
    var Score = Parse
      .Object
      .extend("Socre2");
    var score = new Parse.Query(Score);
    var mactchid = element;
    //console.log(mactchid);
    score.equalTo("match_id", mactchid);
    score.find({
      success: function (datas) {
        //console.log("-----"+datas.length);
        for (var i = 0; i < datas.length; i++) {
          var object = datas[i];
          //console.log(object.id);
          var item = object.get('odds');
          var match_time = object.get('match_time');
          var serial_no = object.get('league');
          //console.log( serial_no);
          var temparray = {};

          for (let j = 0; j < item.length; j++) {
            const e = item[j];

            if (e.companyId == "115" && e.companyName == "威廉希尔") {
              //初始 - 胜/平/负 初始 - 胜/平/负
              var h = e.firstOdds[0];
              var d = e.firstOdds[1];
              var a = e.firstOdds[2];

              var p1 = e.firstReturnRatio;
              var p2 = e.returnRatio;
              //最新 - 胜/平/负
              var h1 = e.odds[0];
              var d1 = e.odds[1];
              var a1 = e.odds[2];

              var rrr = h + "-" + d + "-" + a + "-" + h1 + "-" + d1 + "-" + a1+"-"+p2+"-"+p1;
              temparray['weilian'] = rrr;

            }
            //竞彩官方 2

            if (e.companyId == "-1" && e.companyName == "竞彩") {

              //加入凯利数据和赔付率
              var kh = e.firstKelly[0];
              var kd = e.firstKelly[1];
              var ka = e.firstKelly[2];

              var kh1 = e.kelly[0];
              var kd1 = e.kelly[1];
              var ka1 = e.kelly[2];

              var p1 = e.firstReturnRatio;
              var p2 = e.returnRatio;
              //最新 - 胜/平/负
              var h1 = e.odds[0];
              var d1 = e.odds[1];
              var a1 = e.odds[2];

              var rrr = kh + "-" + kd + "-" + ka + "-" + kh1 + "-" + kd1 + "-" + ka1 + "-" + p2 + "-" + p1 + "-" + h1 + "-" + d1 + "-" + a1;
              temparray['guanfang'] = rrr;
            }
            //bet365 27

            if (e.companyId == "281" && e.companyName == "Bet365") {

              //加入凯利数据和赔付率 加入凯利数据和赔付率
              var kh = e.firstKelly[0];
              var kd = e.firstKelly[1];
              var ka = e.firstKelly[2];

              var kh1 = e.kelly[0];
              var kd1 = e.kelly[1];
              var ka1 = e.kelly[2];

              var p1 = e.firstReturnRatio;
              var p2 = e.returnRatio;

              //初始 - 胜/平/负 初始 - 胜/平/负
              var h = e.firstOdds[0];
              var d = e.firstOdds[1];
              var a = e.firstOdds[2];
              //最新 - 胜/平/负
              var h1 = e.odds[0];
              var d1 = e.odds[1];
              var a1 = e.odds[2];

              var rrr = kh + "-" + kd + "-" + ka + "-" + kh1 + "-" + kd1 + "-" + ka1 + "-" + p1 + "-" + p2 + "-" + h1 + "-" + d1 + "-" + a1;
              temparray['bet365'] = rrr;
            }
            if (e.companyId == "82" && e.companyName == "立博") {
              //初始 - 胜/平/负 初始 - 胜/平/负
              var h = e.firstOdds[0];
              var d = e.firstOdds[1];
              var a = e.firstOdds[2];
              //最新 - 胜/平/负
              var h1 = e.odds[0];
              var d1 = e.odds[1];
              var a1 = e.odds[2];

              var rrr = h + "-" + d + "-" + a + "-" + h1 + "-" + d1 + "-" + a1;
              temparray['interwetten'] = rrr;
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

function Getyinglidata2(element) {
  //console.log(element);
  return new Promise(function (resolve, reject) {
    var Bet = Parse
      .Object
      .extend("Bet2");

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
          var item = object.get('yk');
          id = object.get('match_id');

          //竞彩交易
          var h = item.bettingRatio[0];
          var d = item.bettingRatio[1];
          var a = item.bettingRatio[2];

          //让球 竞彩交易
          var h1 = item.bettingRatio[3];
          var d1 = item.bettingRatio[4];
          var a1 = item.bettingRatio[5];
          //庄家盈亏
          var h2 = item.profitRatio[0];
          var d2 = item.profitRatio[1];
          var a2 = item.profitRatio[2];
          //让球 庄家盈亏
          var h3 = item.profitRatio[3];
          var d3 = item.profitRatio[4];
          var a3 = item.profitRatio[5];

          //投注建议
          var a4 = item.suggest[0];

          //让球 投注建议
          var a5 = item.suggest[1];

          rrr = h + ";" + d + ";" + a + ";" + h1 + ";" + d1 + ";" + a1 + ";" + h2 + ";" + d2 + ";" + a2 + ";" + h3 + ";" + d3 + ";" + a3 + ";" + a4 + ";" + a5 + "&" + id;

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

Parse
  .Cloud
  .define("getpankou", (request, response) => {
    //console.log();

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }

    //定义某天的时间;;
    datetemp = "2019-07-13";

    var GameScore = Parse
      .Object
      .extend("Game2");

    var query = new Parse.Query(GameScore);

    query.equalTo("date", datetemp);
    query.limit(500);

    query.find({
      success: function (results) {

        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          var items = object.get("items");
          for (let j = 0; j < items.length; j++) {
            const element = items[j];
            if (element.dateDesc == "今天") {
              var macthes = element.matches;
              for (let x = 0; x < macthes.length; x++) {
                const element = macthes[x];
                if (GetjingcaiID(element)) {
                  var match_id = element.model.matchId;
                  var match_time = element.model.matchTime;
                  var league = element.model.league;
                  var jingcaiId = element.model.jingcaiId;
                  getpankou(match_id, match_time, league, jingcaiId, datetemp);
                }

              }

            }

          }
        }
        response.success("OK");

      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  });
function getpankou(match_id, match_time, league, jingcaiId, datetemp) {
  //console.log(match_id);
  var url = "https://vipc.cn/i/match/football/" + match_id + "/odds/pankou/";

  Parse
    .Cloud
    .httpRequest({
      url: url,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate, br'
      },
      gzip: true
    })
    .then(function (httpResponse) {
      //console.log(httpResponse.data);
      var Score = Parse
        .Object
        .extend("Pankou");
      var score = new Score();
      score.set("match_id", match_id);
      score.set("match_time", match_time);
      score.set("today", datetemp);
      score.set("league", league);
      score.set("jingcaiId", jingcaiId);
      var temp = httpResponse.data;
      score.save(temp);

      var inputtxt = "";
      var inputtxt1 = "";

      for (let index = 0; index < temp.dxq.length; index++) {
        const element = temp.dxq[index];
        if (element["companyId"] == "8") {
          var a = "";
          a = element["pankou"] + "_" + element["odds"][0] + "_" + element["odds"][1];
          inputtxt += a + "_" + element["returnRatio"] + "_" + element["firstReturnRatio"];

        }
        if (element["companyId"] == "22") {
          var b = "";
          b = element["pankou"] + "_" + element["odds"][0] + "_" + element["odds"][1];
          inputtxt += "_" + b + "_" + element["returnRatio"] + "_" + element["firstReturnRatio"];
        }

      }
      for (let index = 0; index < temp.asia.length; index++) {
        const element1 = temp.asia[index];
        if (element1["companyId"] == "8") {
          var a = "";
          a = element1["pankou"] + "_" + element1["odds"][0] + "_" + element1["odds"][1];
          inputtxt1 += a + "_" + element1["returnRatio"] + "_" + element1["firstReturnRatio"];;
        }
        if (element1["companyId"] == "22") {
          var b = "";
          b = element1["pankou"] + "_" + element1["odds"][0] + "_" + element1["odds"][1];
          inputtxt1 += "_" + b + "_" + element1["returnRatio"] + "_" + element1["firstReturnRatio"];;
        }

      }
   
      //插入到result2

      var query1 = new Parse.Query("Result2");
      query1.equalTo("match_id", match_id);
      query1.first({
        success: function (datas) {

          datas.set("pankou", inputtxt + "_" + inputtxt1);

          datas.save();

        },
        error: function (errors) {
          console.log(errors);
        }

      });

    }, function (httpResponse) {
      // error
      response.error('Request failed with response code ' + httpResponse.status);
    });

}

function GetjingcaiID(element) {

  var array = [ 
    
    "201907136017",


  ];    


  for (let index = 0; index < array.length; index++) {
    const temp = array[index];
    if (element.model.jingcaiId == temp) {
      return true;;
      p
    }
  }
  return false;
}
/*************
   *
   * ClearALl
   * 首次
   * getbisai
   * 每次需要获取
   * getpeilvdata2
   * getbet2
   * getrowdata2
   * getpankou
   *
   * *********** */