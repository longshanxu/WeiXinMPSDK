//获取当日课程信息
const moment= require('moment');
moment.locale('zh-cn');
Parse.Cloud.define("getCalendarByDate", function(request, response) {
  const query = new Parse.Query("Calendar");
  var date = moment(new Date()).format("YYYY-MM-DD");
  query.equalTo("cal_date", date);
  query.include("cal_room_id");
  query.find({ useMasterKey: true }).then((results) => {

      response.success(results);

    }).catch((e) =>  {
      response.error(e);  
    })
});