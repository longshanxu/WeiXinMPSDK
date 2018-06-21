//课程反馈率
var moment = require('moment');
moment.locale("zh-cn");
Parse
.Cloud
.define('feedbackDataOfStudent', (request, response) => {

  var datas = [];
  var last_monday = moment().day(-6).format("YYYY-MM-DD");
  var last_sunday = moment().day(0).format("YYYY-MM-DD");

  const calendar_query = new Parse.Query('Calendar');
  const course_query = new Parse.Query('Course');
  //学校或者院系参数
  var schoolid =request.params.schoolid;
  calendar_query.equalTo("cal_school_id", schoolid);
  calendar_query.greaterThanOrEqualTo('cal_date', last_monday);
  calendar_query.lessThanOrEqualTo('cal_date', last_sunday);
  //查询出上周的所有课程
  var course = [];
  var should_count = {};
  var actual_count = {};
  calendar_query
  .find({useMasterKey: true})
  .then((results) => {
    for(var r in results){
      var calendar = results[r];
      var course_code = calendar.get('cal_course_code');
      course.push(course_code);
      //上过的每种course,应该有多少学生参与，假设每个学生都参与
      //应反馈的总数
      if(should_count.hasOwnProperty(course_code)){
        should_count[course_code] += calendar.get('cal_students').length;
      }else{
        should_count[course_code] = calendar.get('cal_students').length;
      }  
      //实际参与评论的数目    
      var relation = calendar.relation('cal_rating_course'); 
      relation.query().count({
        success:(count)=>{
          if(actual_count.hasOwnProperty(course_code)){
            actual_count[course_code] += count;
          }else{
            actual_count[course_code] = count;
          }
        }
      });  
    }

    course_query.containedIn('cou_code',course);
    return course_query.find();
  }).then((courses)=>{
    courses.map((v,k)=>{
      var code = v.get('cou_code')
      var data = (actual_count[code] == undefined ? 0 : actual_count[code])/should_count[code];
      datas.push({'courseName':v.get('cou_name'),'stu_feedback':data.toFixed(2)*100})
    });

    response.success(datas);

  }).catch((e)=>{
    response.error(e);
  });

});