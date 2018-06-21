//教室使用时长
var moment = require('moment');
moment.locale("zh-cn");
Parse
.Cloud
.define('classroomOccupyHours', (request, response) => {
      var datas = [];
      var schoolid = request.params.schoolid;
      var last_monday = moment().day(-6).format("YYYY-MM-DD");
      var last_sunday = moment().day(0).format("YYYY-MM-DD");

      const calendar_query = new Parse.Query('Calendar');
      const classRoom_query = new Parse.Query('ClassRoom');
      //学校或者院系参数
      calendar_query.equalTo("cal_school_id", schoolid);
      calendar_query.greaterThanOrEqualTo('cal_date', last_monday);
      calendar_query.lessThanOrEqualTo('cal_date', last_sunday);
      //查询出上周的所有课程
      var room = {}
      var room_id = [];
      calendar_query
      .find({useMasterKey: true})
      .then((results) => {
            for(var r in results){
                  var cal_room = results[r].get('cal_room');
                  room_id.push(cal_room);
                  if(room.hasOwnProperty(cal_room)){
                        room[cal_room] += 1;
                  }else{
                        room[cal_room] = 1;
                  }
            }
            classRoom_query.containedIn('objectId',room_id);
            return classRoom_query.find();
      }).then((rooms)=>{
            rooms.map((v,k)=>{
                  datas.push({'roomName':v.get('cr_name'),'useHour':parseInt(room[v.id])*2});
            })
            response.success(datas);
      }).catch((e)=>{
            response.error(e);
      });

});