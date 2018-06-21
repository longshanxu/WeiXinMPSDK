//开课时间分析图

var moment = require('moment');
moment.locale("zh-cn");
Parse
.Cloud
.define('startTimeOfCalendar', (request, response) => {
        var  cq  = new  Parse.Query("Calendar");
        var   weekStart = moment().locale("+800").startOf("week");
        var   weekEnd = moment().locale("+800").endOf("week");
        var  obj={
               "openLate":0,
               "openOnTime": 0,
               "closeLate" :0,
               "closeOnTime" :0
        };
        var schoolid =request.params.schoolid;
        cq.equalTo("cal_state","课后");
        cq.equalTo("cal_school_id",schoolid);
        cq.greaterThanOrEqualTo("cal_date",weekStart.format("YYYY-MM-DD").toString() );//>= 当前天所在周的第一天
        cq.lessThanOrEqualTo("cal_date",weekEnd.format("YYYY-MM-DD").toString());//<= 当前天所在周的最后一天
        cq.find({useMasterKey:true}).then((cal)=>{
            console.log(cal);
                    var count =1;  
                     var i=1  ;
                     var j=1;
                     var n=1;
                   cal.map((v,k)=>{
                     var start=   v.get("cal_section_time").split("--");
                     var startcourse=moment(v.get("cal_open_course")).format('HH:mm:ss');   
                     var endcourse=  moment(v.get("cal_close_course")).format('HH:mm:ss');       
                     if(startcourse>start[0]){                 
                            obj.openLate=count;
                            count+=1; 
                     }else if(startcourse<start[0]){                
                            obj.openOnTime=i;
                            i++;
                     };
                      if(endcourse<start[1]){
                                obj.closeLate=j;
                                j++;
                     }else if(endcourse>start[1]){
                                obj.closeOnTime=n;
                                n++;
                     };

                   });
                   console.log(obj);
                   var courseArr=[];
                   for(var key in obj){
                      var closeobj={}; 
                           if(key=="openLate"){
                              closeobj.time=obj[key];
                              closeobj.title="晚点开课次数";
                          }else if(key=="openOnTime"){
                              closeobj.time=obj[key];
                              closeobj.title="正常开课次数";
                          }else if(key=="closeLate"){
                              closeobj.time=obj[key];
                              closeobj.title="晚点下课次数";
                          }else if(key=="closeOnTime"){
                              closeobj.time=obj[key];
                              closeobj.title="正常下课次数";
                          };
                       courseArr.push(closeobj);
                   }
             
                   response.success(courseArr);
        });
});