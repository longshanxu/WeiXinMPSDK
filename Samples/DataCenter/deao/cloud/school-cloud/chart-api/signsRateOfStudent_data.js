//出勤率
const percent = require("../reportform-api/GetPercent");
var moment = require('moment');
moment.locale("zh-cn");
Parse
.Cloud
.define('signsRateOfStudent', (request, response) => {

      var stuArr=[];
        var  cq  = new  Parse.Query("Calendar");
        var ssq = new Parse.Query("StudentSigns");
        var   weekStart = moment().locale("+800").startOf("week");
        var   weekEnd = moment().locale("+800").endOf("week");
        cq.equalTo("cal_state","课后");
        var schoolid =request.params.schoolid;
        cq.equalTo("cal_school_id",schoolid);
        cq.greaterThanOrEqualTo("cal_date",weekStart.format("YYYY-MM-DD").toString() );//>= 当前天所在周的第一天
        cq.lessThanOrEqualTo("cal_date",weekEnd.format("YYYY-MM-DD").toString());//<= 当前天所在周的最后一天
        cq.find({useMasterKey:true}).then((cal)=>{
                        cal.map((v,k)=>{
                              var obj={};
                              obj.name=v.get("cal_title");
                              obj.id=v.id;
                              obj.num=v.get("cal_students").length;
                              stuArr.push(obj);
                        });

         var arr = [];
         stuArr.sort();
         var n=0;
         for (var i = 0; i < stuArr.length;) {         //去掉重复教师的数量
                var count = 0;
                var total=0;           
                for (var j = i; j < stuArr.length; j++) {
                     
                        if (stuArr[i].name === stuArr[j].name) {
                            count++;
                            total+=stuArr[n].num;
                            console.log("total:",stuArr[n].num);
                            n++;
                        }
                };
                arr.push({
                name: stuArr[i].name,
                id:stuArr[i].id,
                num:total,
                })
                i+=count;
            };
               console.log(arr);      
            var courseArr = [];
            ssq.find({useMasterKey:true}).then((result)=>{
                  arr.map((n,i)=>{
                        var count=0;
                        var course={};
                        result.map((v,k)=>{
                              if(n.id==v.get("ss_calendar_id")){
                                          count++;
                                          course.name=n.name;
                                          course.rating=percent.Percent(count,n.num);    
                              };
                              
                        })
                        courseArr.push(course);
                  });

                  response.success(courseArr);
            }) 
        });

       

});