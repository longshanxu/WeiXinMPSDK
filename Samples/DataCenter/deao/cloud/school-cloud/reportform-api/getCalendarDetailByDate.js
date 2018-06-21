//获取当日总课程数，已完成、未完成课程数，人数，教师个数，班级个数

const fun = require("../reportform-api/GetPercent");
const moment= require('moment');
moment.locale('zh-cn');
Parse.Cloud.define("getCalendarDetailByDate", function(request, response) {
  const query = new Parse.Query("Calendar");
  const query1 = new Parse.Query("Calendar");
  const sq = new Parse.Query("Student");
  //定义一个空对象，便于存储返回的值
  var result={
        "total":"",
        "uncomplete":"",
        "complete":"",
        "classes":"",
        "teacher":"",
        "students":""
  };
  var classesArr=[]; 
  var teaNumberArr=[];
  var date = moment(new Date()).format("YYYY-MM-DD");
  query.equalTo("cal_date", date);
  //获取当天的总课时，上课班级，教师数量
  query.find({ useMasterKey: true }).then((results) => {
             var teacher=0;
             result.total=results.length;
             results.map((v,k)=>{
                 classesArr.push(v.get("cal_classes"));
                 teaNumberArr.push(v.get("cal_teacher")[0].number);
                 teacher+=v.get("cal_teacher").length;          
             });
             result.classes=fun.removeArr(classesArr).length;
             result.teacher=fun.removeArr(teaNumberArr).length;
    }).then(()=>{
          var claArr=fun.removeArr(classesArr);
          sq.containedIn("stu_classes",claArr);
          sq.limit(1000);
          //获取学生数量
          sq.count({ useMasterKey: true }).then((student)=>{
                result.students=student;
          }).then(()=>{
                    query1.equalTo("cal_state","课后");
                    query1.equalTo("cal_date",date);
                    //获取当天完成课时
                    query1.count({useMasterKey:true}).then((complete)=>{
                          result.complete=complete;
                          result.uncomplete=result.total-complete;      
                          response.success(result);  
                    });
          }).catch((e)=>{
                          response.error(e);
                    });   
           
    }).catch((e)=>{
          response.error(e);
    });
});