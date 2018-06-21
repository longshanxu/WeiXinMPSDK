//获取教室课程信息
var moment = require('moment');
moment.locale('zh-cn');

Parse
  .Cloud
  .define("getScheduleByRoomid", function (request, response) {

    var roomid = request.params.roomid; //教室objectID

    var Classroom = Parse
      .Object
      .extend("ClassRoom");
    var roomQuery = new Parse.Query(Classroom);
    var schedule = [];//当天教室中安排的课程的数组

    roomQuery
      .get(roomid, {useMasterKey: true})
      .then((object) => {
        return roomQuery.get(roomid, {useMasterKey: true});
      })
      .then((classroom) => {
        const query = new Parse.Query("Calendar");

        const today = moment()
          .format("YYYY-MM-DD")
          .toString();

        query.equalTo("cal_date", today);
        query.equalTo("cal_room", classroom.id);
        query.equalTo("cal_school_id",classroom.get("cr_school_id"));

        return query.find({useMasterKey: true});
      }).then((results)=>{
        for (let i = 0; i < results.length; i++) {
          schedule.push(results[i]);
        }
        response.success(schedule);
      })
      .catch((error) => {
        response.error(error)
      });

  });