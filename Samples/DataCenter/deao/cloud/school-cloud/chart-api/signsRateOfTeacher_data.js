//教师签到率
var moment = require('moment');
moment.locale("zh-cn");
Parse
  .Cloud
  .define('signsRateOfTeacher', (request, response) => {

    var datas = [];
    var name = {}; //教师名
    var counts = {}; //教师上周的上课总数
    var signs = {}; //教师上周上课的签到开课次数

    var last_monday = moment()
      .day(-6)
      .format('YYYY-MM-DD'); //上周一
    var last_sunday = moment()
      .day(0)
      .format('YYYY-MM-DD'); //上周日


    const calendar_query = new Parse.Query('Calendar');
    //学校或者院系参数

    var schoolid =request.params.schoolid;
    calendar_query.equalTo("cal_school_id",schoolid);
    calendar_query.greaterThanOrEqualTo('cal_date', last_monday);
    calendar_query.lessThanOrEqualTo('cal_date', last_sunday);
    //查询出上周的所有课程
    calendar_query
      .find({useMasterKey: true})
      .then((results) => {

        for (var k in results) {
          var calendar = results[k];
          var teachers = calendar.get('cal_teacher'); //每节课的上课教师

          for (var t in teachers) {
            var teacher = teachers[t];

            name[teacher.tcherid] = teacher.name;
            
            if (counts.hasOwnProperty(teacher.tcherid)){
              counts[teacher.tcherid] += 1;
            }else{
              counts[teacher.tcherid] = 1;
            }
            //counts[teacher.tcherid] = counts.hasOwnProperty(teacher.tcherid) ? (counts[teacher.tcherid]+1) : 1;


            if (signs.hasOwnProperty(teacher.tcherid)){
              
              signs[teacher.tcherid] += (calendar.get('cal_open_course') != undefined ? 1 : 0) ;
            }else{
              
              signs[teacher.tcherid] = 0 + (calendar.get('cal_open_course') != undefined ? 1 : 0);
            }
          }

        }


      })
      .then(() => {

        for (var item in name) {
 
          var signData = signs[item] / counts[item];
          datas.push({
            'teacherName': name[item],
            'teacherSigns': signData.toFixed(2)*100
          });
        }

        response.success(datas);

      })
      .catch((e) => {
        response.error(e);
      });

  });