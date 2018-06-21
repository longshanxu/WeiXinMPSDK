//获得当天课程的签到率

const fun = require("../reportform-api/GetPercent");

const moment= require('moment');
moment.locale('zh-cn');
Parse.Cloud.define("getSignsByDate", function(request, response) {
  const query = new Parse.Query("Calendar");
  var calArr=[];
  var date = moment(new Date()).format("YYYY-MM-DD");
  query.equalTo("cal_date", date);
  query.equalTo("cal_state","课后");
  query.find({ useMasterKey: true })
  .then((results) => {
             results.map((v,k)=>{
                     var result ={
                        "calname":"",
                        "calcontent":"",
                        "calsectiontime":"",
                        "signs":"",
                        "student":""
                    };
                        result.calname=v.get("cal_title");
                        result.calcontent=v.get("cal_content");
                        result.calsectiontime=v.get("cal_section_time");
                        result.student=v.get("cal_students").length;
                        var stu=0;
                        v.get("cal_students").map((i,j)=>{
                                if(i.sign==="true"){
                                    stu+=1;
                                }
                        });
                        result.signs=fun.GetPercent(stu,result.student);
                        calArr.push(result);
                })
                     response.success(calArr);
            }).catch((e) =>  {
                       response.error(e);
                 });
    
});