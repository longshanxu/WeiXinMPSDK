Parse
  .Cloud
  .define("ClearAll", (request, response) => {

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var datetemp = year + "-" + month + "-" + day;
    if (month < 10) {
      datetemp = year + "-0" + month + "-" + day;
    }
    clear(datetemp,"Result");
    clear(datetemp,"Bet");
    clear(datetemp,"Socre");

    response.success("OK");

  });

function clear(e,type) {
    var Result = Parse
      .Object
      .extend(type);
    var reset = new Parse.Query(Result);
    reset.equalTo("today", e);
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