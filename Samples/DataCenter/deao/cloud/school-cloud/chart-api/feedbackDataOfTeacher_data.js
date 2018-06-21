//教师反馈率
var moment = require('moment');
moment.locale("zh-cn");
Parse
.Cloud
.define('feedbackDataOfTeacher', (request, response) => {
   
      var datas = [];
      var last_monday = moment().day(-6).format("YYYY-MM-DD");
      var last_sunday = moment().day(0).format("YYYY-MM-DD");

      const calendar_query = new Parse.Query('Calendar');
      //学校或者院系参数
      var schoolid =request.params.schoolid;
      calendar_query.equalTo("cal_school_id", schoolid);
      calendar_query.greaterThanOrEqualTo('cal_date', last_monday);
      calendar_query.lessThanOrEqualTo('cal_date', last_sunday);
      //查询出上周的所有课程
      var name = {};
      var should_count = {};
      var actual_count = {};
      calendar_query
      .find({useMasterKey: true})
      .then((results) => {
        for(var r in results){
          var calendar = results[r];
          var teachers = calendar.get('cal_teacher');//每节课的上课教师
          for (var t in teachers){
            var tcher = teachers[t];
            
            name[tcher.tcherid] = tcher.name;          
            
            //应反馈的总数
            if(should_count.hasOwnProperty(tcher.tcherid)){
              should_count[tcher.tcherid] += calendar.get('cal_students').length;
            }else{
              should_count[tcher.tcherid] = calendar.get('cal_students').length;
            }

            var relation = calendar.relation('cal_rating_course'); 
            relation.query().count({
              success:(count)=>{
                if(actual_count.hasOwnProperty(tcher.tcherid)){
                  actual_count[tcher.tcherid] += count;
                }else{
                  actual_count[tcher.tcherid] = count;
                }
              }

            });           
          }
        }
        return calendar_query.find();
      }).then(()=>{

        console.log(actual_count,should_count);
        for(var n in name){
          var data = (actual_count[n] == undefined ? 0 : actual_count[n])/should_count[n];
          datas.push({'teacherName':name[n],'tch_feedback':data.toFixed(2)*100})
        }
        response.success(datas);

      }).catch((e)=>{
        response.error(e);
      });

      

});