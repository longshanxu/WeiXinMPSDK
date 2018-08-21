/**
 * @description 删除知识点
 * @author liangwei.xia
 * @since 2018-1-11
 */

//bet 数据
//https://mobile.288365.com/#type=Splash;key=1;ip=0;lng=2
//获取今天的比赛
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
    // 知识点模板接口 require("./kaoxue-cloud/pc-api/knowledgeTemplete/addKnowLedge");
    // require("./kaoxue-cloud/pc-api/knowledgeTemplete/deleteKnowLedgeById");
    // require("./kaoxue-cloud/pc-api/knowledgeTemplete/updateKnowLedge");

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

function GetData(match_id, serial_no, match_time,datetemp) {
  //console.log(match_id);
  var url = "https://apic.itou.com/api/mdata/proxya?platform=koudai_wx&_prt=https&ver=2018010" +
      "1000000&interface=mc.data.odds.getOdds&dc=1539239293&SportId=1&MatchID=" + match_id + "&betting_type_id=1&itoukey=155352b9a7cd26dadd714f41cab3e52f&app_key=C14F562F-C6E" +
      "0-45E3-A2C4-E807BA99B018&device_id=&app_id=C14F562F-C6E0-45E3-A2C4-E807BA99B018+" +
      "+&channel=app.cps.31120.20.a.okooo.com&VersionNum=1.0.0.1&CodeVer=20161010-001";
  Parse
    .Cloud
    .httpRequest({
      url: url,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
    .then(function (httpResponse) {
      // success console.log(httpResponse.data);
      var Score = Parse
        .Object
        .extend("Socre");
      var score = new Score();

      score.set("match_id", match_id);
      score.set("match_time", match_time);
      score.set("serial_no", serial_no);
      score.set("today", datetemp);
      score.save(httpResponse.data);

    }, function (httpResponse) {
      // error
      response.error('Request failed with response code ' + httpResponse.status);
    });

}

//获取赔率
Parse
  .Cloud
  .define("getpeilvdata", (request, response) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }
    var GameScore = Parse
      .Object
      .extend("GameScore");

    var query = new Parse.Query(GameScore);

    query.equalTo("date", datetemp);

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
            var serial_no = x[key]["serial_no"];
            var match_time = x[key]["match_time"];

            GetData(match_id, serial_no, match_time,datetemp);

          }

        }
        response.success("OK");
      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });

  });

function Getbetdata(match_id,today) {
  //console.log(match_id);
  var url = "https://apic.itou.com/api/mdata/proxya?platform=koudai_wx&_prt=https&ver=2018010" +
      "1000000&interface=mc.data.exchanges.getexchanges&_dc=1539239293&sportId=1&MatchI" +
      "D=" + match_id + "&itoukey=155352b9a7cd26dadd714f41cab3e52f&app_key=C14F562F-C6E0-45E3-A2C4-E807BA" +
      "99B018&device_id=&app_id=C14F562F-C6E0-45E3-A2C4-E807BA99B018&channel=app.cps.31" +
      "120.20.a.okooo.com&VersionNum=1.0.0.1&CodeVer=20161010-001";

  Parse
    .Cloud
    .httpRequest({
      url: url,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
    .then(function (httpResponse) {
      // success console.log(httpResponse.data);
      var Bet = Parse
        .Object
        .extend("Bet");
      var bet = new Bet();

      bet.set("match_id", match_id);
      bet.set("today", today);
      bet.save(httpResponse.data);

    }, function (httpResponse) {
      // error
      response.error('Request failed with response code ' + httpResponse.status);
    });

}

Parse
  .Cloud
  .define("getbet", (request, response) => {

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
            Getbetdata(match_id,datetemp);

          }

        }
        response.success("OK");
      },
      error: function (error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  });


  /*************
   * 
   * 首次
   * getgamebytoday
   * 每次需要获取
   * getpeilvdata
   * getbet
   * 
   * 
   * *********** */
