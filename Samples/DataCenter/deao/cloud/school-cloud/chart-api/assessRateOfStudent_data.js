//学生评估率
var moment = require('moment');
moment.locale("zh-cn");
const percent = require("../reportform-api/GetPercent");
Parse
.Cloud
.define('assessRateOfStudent', (request, response) => {
        var  cq  = new  Parse.Query("Calendar");    
        var schoolid=request.params.schoolid;  
        var   weekStart = moment().locale("+800").startOf("week");
        var   weekEnd = moment().locale("+800").endOf("week");
        var  trq = new Parse.Query("TeacherRatingStudent");
        var teaArr=[];
        cq.equalTo("cal_state","课后");
        cq.equalTo("cal_school_id",schoolid);
        cq.greaterThanOrEqualTo("cal_date",weekStart.format("YYYY-MM-DD").toString() );//>= 当前天所在周的第一天
        cq.lessThanOrEqualTo("cal_date",weekEnd.format("YYYY-MM-DD").toString());//<= 当前天所在周的最后一天
        cq.find({useMasterKey:true}).then((cal)=>{
            cal.map((v,k)=>{
                    var obj={};
                     console.log((v.get("cal_teacher"))[0].name);
                     obj.name=(v.get("cal_teacher"))[0].name;
                     obj.calid=v.id;
                     obj.id=(v.get("cal_teacher"))[0].tcherid;
                     obj.count=v.get("cal_count");
                     teaArr.push(obj);  
            });
         var arr = [];
        teaArr.sort();
         for (var i = 0; i < teaArr.length;) {         //去掉重复教师的数量
                var count = 0;
                for (var j = i; j < teaArr.length; j++) {
                        if (teaArr[i].id === teaArr[j].id) {
                            count++;
                        }
                }
                arr.push({
                name: teaArr[i].name,
                id:teaArr[i].id,
                calid:teaArr[i].calid,
                num:teaArr[i].count,
                count: count
                })
                i+=count;
            };
            
            trq.find({useMasterKey:true}).then((rating)=>{  // 查询所有评价
                        var tearating=[];
                            arr.map((n,i)=>{
                                var tea={};
                                var i=1;
                                 rating.map((v,k)=>{
                                     console.log(n.calid);
                                    if(v.get("trc_calendar_id")==n.calid){      //判断是否是本周内的老师所上的课

                                            tea.name=n.name;
                                            tea.ratingnum=i;
                                            tea.count=(n.count)*(n.num);
                                            tea.rating=percent.Percent(i,(n.count)*(n.num));
                                            i++;
                                    }
                            });
                            tearating.push(tea);
                    });
                    response.success(tearating);
            })
        })
});