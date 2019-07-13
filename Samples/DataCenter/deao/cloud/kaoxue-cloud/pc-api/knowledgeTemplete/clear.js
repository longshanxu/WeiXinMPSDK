var colors = require('colors');

Parse
  .Cloud
  .define("ClearAll2", (request, response) => {

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }

    datetemp = "2019-07-13";;

    clear2(datetemp, "Result2");
    clear2(datetemp, "Bet2");
    clear2(datetemp, "Socre2");
    clear2(datetemp, "Pankou");
    response.success("OK");

  });

function clear2(e, type) {
  var Result = Parse
    .Object
    .extend(type);
  var reset = new Parse.Query(Result);
  //reset.equalTo("today", e);
  reset.find({
    success: function (ss) {

      for (var i = 0; i < ss.length; i++) {
        // This does not require a network access.
        var s = ss[i];
        s.destroy();
        s.save();
      }

    }
  });
}

///清理数据
/********
   *
   * ClearAll2
   *
   *
   */