/**
 * 获取一周的课表请求
 */
var moment = require('moment');
moment.locale("zh-cn");

// 判断数组是否包含元素
function contains(arr, bind_number) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i].number === bind_number) {  
            return true;  
        }  
    }  
    return false;  
}  

Parse.Cloud.define("getCalendarOfWeek",(req,res)=>{

    var openid = req.params.oid;//登录用户的openid，通过该openid，获取学校的objectid
    var currentweek,offset;
    if(req.params.currentweek != undefined && req.params.offset != undefined){
        currentweek = req.params.currentweek;
        offset = req.params.offset;
    }

    var bind_query = new Parse.Query('Bindings');
    var query = new Parse.Query("Calendar");
        query.include("cal_room_id");

    var weekStart = null,
        weekEnd = null;

    if(currentweek != undefined && offset != undefined){
        console.log("传入当前周与偏移量");
        var naturalweek = ~~currentweek + ~~offset;
        weekStart = moment().week(naturalweek).locale("+800").startOf("week");
        weekEnd = moment().week(naturalweek).locale("+800").endOf("week");

    }else if(currentweek == undefined && offset == undefined) {
        console.log("未传入");
        //当前日期所在周的第一天    
        weekStart = moment().locale("+800").startOf("week");
        //当前日期所在周的最后一天    
        weekEnd = moment().locale("+800").endOf("week");
    }

    var data = {
        "code":200,
        "data":{
            "title":13,
            "data":{
                "周一":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}],
                "周二":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.clone().add(1,"day").format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}],
                "周三":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.clone().add(2,"day").format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}],
                "周四":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.clone().add(3,"day").format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}],
                "周五":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.clone().add(4,"day").format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}],
                "周六":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.clone().add(5,"day").format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}],
                "周日":[{"id":null,"title":null,"room":null,"person":null,
                    "date":weekStart.clone().add(6,"day").format("YYYY-MM-DD"),"period":null,"roomSeat":null,"isSigns":0,"content":null,"studentCounts":null,"roomid":null,"schoolid":null,"openid":null}] 
            }
        },
        "event":200
    };

    bind_query.equalTo('bind_open_id',openid);
    bind_query.find({useMasterKey:true}).then((binds)=>{
        const school_id = binds[0].get("bind_school_id");
        const bind_type = binds[0].get("bind_type");
        const bind_number = binds[0].get("bind_number");
        console.log('cal',school_id);
        console.log('cal',bind_type);
        console.log('cal',bind_number);
        query.equalTo("cal_school_id",school_id);
        query.greaterThanOrEqualTo("cal_date",weekStart.format("YYYY-MM-DD").toString() );//>= 当前天所在周的第一天
        query.lessThanOrEqualTo("cal_date",weekEnd.format("YYYY-MM-DD").toString());//<= 当前天所在周的最后一天

        query.find({useMasterKey:true}).then((results)=>{

            var temp = [];
            // 根据身份返回课程
            for(var key in results){
                // console.log("results",results.length);
                
                var element = results[key];//某一周所有的课
                var cal_teacher = element.get("cal_teacher");
                var cal_students = element.get("cal_students"); 

                if(bind_type == "老师"){
                    if(cal_teacher != undefined && cal_teacher.length > 0){
                        if(contains(cal_teacher, bind_number) == true){
                            temp.push(element);
                        }
                    }
                }else if(bind_type == "学生"){
                    if(cal_students != undefined && cal_students.length > 0){
                        // console.log("筛选")
                        // console.log(contains(cal_students, bind_number));
                        if(contains(cal_students, bind_number) == true){
                            temp.push(element);
                        }
                    }
                }
                // console.log("temp",temp.length);
            }

            for (var key in temp) {
                    
                    var element = temp[key];//某一周所有的课
                    console.log("element",element.get("cal_date"));
                    var cal_teacher = element.get("cal_teacher");
                    var cal_students = element.get("cal_students");                    
                    var teacher = "";

                    if(cal_teacher!=undefined && cal_teacher.length > 0){
                        for(var i = 0, l = cal_teacher.length;i<l;i++){
                            teacher += cal_teacher[i].name + " ";
                        }                
                    }
    
                    var value = {"id":element.id,"title":element.get("cal_title"),"room":element.get("cal_room_id").get("cr_name"),"person":teacher,
                    "date":element.get("cal_date"),"period":element.get("cal_section_time"),"roomSeat":30,"isSigns":0,"content":element.get("cal_content"),
                    "studentCounts":element.get("cal_count"),"roomid":element.get("cal_room_id").id,"schoolid":school_id,"openid":openid};
    
                    var week = element.get("cal_date");   
                    const weekDay = new Date(week).getDay();
                    
                    if(weekDay == 1){
                        data.data.data.周一.push(value);
                    }else if (weekDay == 2){                        
                        data.data.data.周二.push(value);
                    }else if (weekDay == 3){
                        data.data.data.周三.push(value);
                    }else if (weekDay == 4){
                        data.data.data.周四.push(value);
                    }else if (weekDay == 5){
                        data.data.data.周五.push(value);
                    }else if(weekDay == 6){
                        data.data.data.周六.push(value);
                    }else if (weekDay == 0){
                        data.data.data.周日.push(value);
                    }
                }
                res.success(data);
        });
    }).catch((error)=>{
        res.error(error);
    });
    
});