//新增教学日历
var moment = require('moment');
moment.locale("zh-cn");

var beforeLesson_teacher = require('../queue-api/beforeLesson_teacher_queue_function');
var afterLesson_teacher = require('../queue-api/afterLesson_teacher_queue_function');
var beforeLesson_student = require('../queue-api/beforeLesson_student_queue_function');
var afterLesson_student = require('../queue-api/afterLesson_student_queue_function');
var beforeLesson_24hours = require('../queue-api/beforeLesson_24hours_queue_function');
//插入理论课，实践课的方法
function  insertcalendar(cal,roomarr,teacherarr,stuarr,educationalid,type){
    var  Calendar = Parse.Object.extend("Calendar");
    var  ClassRoom = Parse.Object.extend("ClassRoom");
    var eq = new Parse.Query("Educational");
    console.log(beforeLesson_teacher);
             for(var k=0;k<cal.length;k++){
                             var v =cal[k];
                               console.log(v.cal_room);
                               var room = new ClassRoom();
                               console.log(room);
                               room.id=v.cal_room;
                               var  calendar = new Calendar();
                               var cal_section= v.cal_section;
                               var  date = moment(v.cal_date).format("YYYY-MM-DD");
                               console.log(date);
                                if(cal_section=="1-2"){
                                    calendar.set("cal_section_time","08:00:00--09:30:00");
                                    calendar.set("cal_begin_course",new Date(date+ " 08:00:00"));
                                    calendar.set("cal_end_course",new Date(date+ " 09:30:00"));
                                }else if(cal_section=="3-4"){
                                    calendar.set("cal_section_time","10:00:00--11:30:00");
                                    calendar.set("cal_begin_course",new Date(date+ " 10:00:00"));
                                    calendar.set("cal_end_course",new Date(date+ " 11:30:00"));
                                }else if(cal_section=="5-6"){
                                    calendar.set("cal_section_time","13:00:00--14:30:00");
                                    calendar.set("cal_begin_course",new Date(date+ " 13:00:00"));
                                    calendar.set("cal_end_course",new Date(date+ " 14:30:00"));
                                }else if(cal_section=="7-8"){
                                    calendar.set("cal_section_time","14:40:00--16:10:00");  
                                    calendar.set("cal_begin_course",new Date(date+ " 14:40:00"));
                                    calendar.set("cal_end_course",new Date(date+ " 16:10:00"));                      
                                };
                                for(var i=0;i<roomarr.length;i++){
                                    if(roomarr[i].roomid==v.cal_room){
                                        //console.log(calendar);
                                        calendar.set("cal_buildings",roomarr[i].building);
                                        calendar.set("cal_floor",roomarr[i].floor);
                                        calendar.set("cal_device",roomarr[i].device_id);
                                    }
                                };
                                console.log("ssssssssssssss");
                                console.log(type);
                                    if(type=="实践"){
                                        console.log("dddd");
                                        console.log(v.cal_teacher.length);
                                        console.log(teacherarr.length);
                                          var teaArr1=[];
                                            for(var n=0;n<v.cal_teacher.length;n++){
                                                for(var j=0;j<teacherarr.length;j++){  
                                                 
                                                     console.log("cccc:",n);
                                                    if(teacherarr[j].tcherid==v.cal_teacher[n]){
                                                        console.log("cccc:",teacherarr[j]);
                                                            teaArr1.push(teacherarr[j]);
                                                            continue;
                                                    }
                                             }
                                            
                                        };
                                        console.log("practice:",teaArr1);
                                        calendar.set("cal_teacher",teaArr1);
                                }else if(type=="理论"){
                                        for(var j=0;j<teacherarr.length;j++){  
                                                if(teacherarr[j].tcherid==v.cal_teacher){
                                                    var  teaArr =[];
                                                    teaArr.push(teacherarr[j]);
                                                    calendar.set("cal_teacher",teaArr);
                                                }
                                        };
                                     
                                };
                                  
                                calendar.set("cal_classes",v.cal_classes);
                                calendar.set("cal_content",v.cal_content);
                                calendar.set("cal_course_code",v.cal_course_code);
                                calendar.set("cal_course_type",v.cal_course_type);
                                calendar.set("cal_date",date);
                                calendar.set("cal_faculty",v.cal_faculty);
                                calendar.set("cal_grade",v.cal_grade);
                                calendar.set("cal_level",v.cal_level);
                                calendar.set("cal_major",v.cal_major);
                                calendar.set("cal_room",v.cal_room);
                                calendar.set("cal_school_id",v.cal_school_id);
                                calendar.set("cal_term",v.cal_term);
                                calendar.set("cal_title",v.cal_title);
                                calendar.set("cal_total_hours",v.cal_total_hours);
                                calendar.set("cal_week",v.cal_week);
                                calendar.set("cal_count",v.student_count);
                                calendar.set("cal_section",v.cal_section);
                                calendar.set("cal_semester",v.cal_semester);
                                calendar.set("cal_campus",v.cal_campus);
                                calendar.set("cal_room_id",room);
                                calendar.set("cal_state","课前");   
                                calendar.set("cal_team_status",v.status);
                                calendar.set("cal_students",stuarr);   
                                calendar.set("cal_teaching_task",educationalid);   
                                calendar.save({
                                        success:(res)=>{
                                            console.log("xia");
                                            beforeLesson_teacher.beforeLesson_teacher(res.id);
                                            afterLesson_teacher.afterLesson_teacher(res.id);
                                            beforeLesson_student.beforeLesson_student(res.id);
                                            afterLesson_student.afterLesson_student(res.id);
                                            beforeLesson_24hours.beforeLesson_24hours(res.id);
                                            //将教学任务状态改为发布
                                            eq.get(educationalid,{useMasterKey:true}).then((edu)=>{
                                                    edu.set("edu_state","发布");
                                                    edu.save();
                                            });
                                            
                                   
                                        },
                                        error:(e)=>{
                                            response.error(e);
                                        }
                                });       
                    };
                   
};


Parse.Cloud.define("insertCalendarByObjectId", function(request, response) {
            var calInArr = request.params.calendarlist;
            var callist = JSON.parse(calInArr);
            var  Calendar = Parse.Object.extend("Calendar");
            var  ClassRoom = Parse.Object.extend("ClassRoom");
            var eq = new Parse.Query("Educational");
            var tq =new Parse.Query("Teacher");
            var tq1 =new Parse.Query("Teacher");
            var  rq = new Parse.Query("ClassRoom");
            var  rq1 = new Parse.Query("ClassRoom");
            var sq =new Parse.Query("Student");
            var  roomInArr = [];
            var  roomInArr1 = [];           
            var roomIdArr=[];
            var roomIdArr1=[];
            var teacherArr=[];
            var teacherArr1=[];
            var teacherInArr=[];
            var teacherInArr1=[];
            var stuArr=[];
            //插入理论课
            if(callist.theory.length>0 && callist.practice.length==0){
                console.log("理论");
                   callist.theory.map((v,k)=>{
                        var roomid=  v.cal_room;
                        var teacherid=v.cal_teacher;
                        roomIdArr[k]=roomid;
                        teacherArr[k]=teacherid;                
                    });    

              var classid=(callist.theory)[0].cal_classes;
              //根据班级id获得学生
              sq.equalTo("stu_classes",classid);
              sq.find({useMasterKey:true}).then((student)=>{
                 student.map((v,k)=>{
                           var  stu = {                               
                                        "objectid": v.id,
                                        "name": v.get("stu_name"),
                                        "number": v.get("stu_number"),
                                        "gender":v.get("stu_gender"),
                                        "score":"0",
                                        "times":"0",
                                        "sign":"false"
                                        };
                        stuArr.push(stu);

                 });
             }).then(()=>{   
                //获得教室数组获得校区、教学楼、设备信息，
               rq.containedIn("objectId",roomIdArr);
               rq.find({useMasterKey:true,}).then((room)=>{
                    room.map((v,k)=>{
                            var classroom={
                                        "roomid":v.id,
                                        "building":v.get("cr_teachingbuilding_id"),
                                        "floor":v.get("cr_floor"),
                                        "device_id":v.get("cr_device_id")
                         };
                         roomInArr.push(classroom);

                    })
                }).then(()=>{  
                       //获得老师信息
                         tq.containedIn("objectId",teacherArr);  
                         tq.find({useMasterKey:true}).then((teacher)=>{
                                teacher.map((v,k)=>{
                                        var tea={
                                            "tcherid":v.id,
                                            "number":v.get("tcher_number"),
                                            "gender":v.get("tcher_gender"),
                                             "name":v.get("tcher_name")
                                        };
                                    teacherInArr.push(tea);
                                })
                         }).then(()=>{
                             //插入理论课
                             var type="理论";
                        insertcalendar(callist.theory,roomInArr,teacherInArr,stuArr,callist.educationalid,type);     
                        response.success({"status":"success"});
                     })
                }) 
             }) 
                //插入实践课
            }else if(callist.theory.length==0 && callist.practice.length>0){
                console.log("实践");
                  callist.practice.map((v,k)=>{
                     var roomid=  v.cal_room;
                     var teacherid=v.cal_teacher;
                     console.log(roomid);
                     roomIdArr1[k]=roomid;
                     teacherArr1[k]=teacherid; 
                });    
              var classid=(callist.practice)[0].cal_classes;
              //根据班级id获得学生
              sq.equalTo("stu_classes",classid);
              sq.find({useMasterKey:true}).then((student)=>{
                 student.map((v,k)=>{
                           var  stu = {                               
                                        "objectid": v.id,
                                        "name": v.get("stu_name"),
                                        "number": v.get("stu_number"),
                                        "gender":v.get("stu_gender"),
                                        "score":"0",
                                        "times":"0",
                                        "sign":"false"
                                        };
                        stuArr.push(stu);
                 });
             }).then(()=>{  
                  //获得教室数组获得校区、教学楼、设备信息，               
                        rq1.containedIn("objectId",roomIdArr1);
                        rq1.find({useMasterKey:true,}).then((room1)=>{
                        room1.map((v,k)=>{
                                var classroom={
                                            "roomid":v.id,
                                            "building":v.get("cr_teachingbuilding_id"),
                                            "floor":v.get("cr_floor"),
                                            "device_id":v.get("cr_device_id")
                            };
                            roomInArr1.push(classroom);
                        })
                }).then(()=>{
                     //获取教师信息 
                         tq1.find({useMasterKey:true}).then((teacher1)=>{
                                teacher1.map((v,k)=>{
                                        var tea={
                                            "tcherid":v.id,
                                            "number":v.get("tcher_number"),
                                            "gender":v.get("tcher_gender"),
                                             "name":v.get("tcher_name")
                                        };
                                    teacherInArr1.push(tea);
                                  
                         });
                }).then(()=>{
                    var type="实践";
                      insertcalendar(callist.practice,roomInArr1,teacherInArr1,stuArr,callist.educationalid,type);     
                      response.success({"status":"success"});
                     })
                }) 
             })      
              //插入理论、实践课
            }else if(callist.theory.length>0 && callist.practice.length>0){
                
                    callist.theory.map((v,k)=>{
                     var roomid=  v.cal_room;
                     var teacherid=v.cal_teacher;
                     roomIdArr[k]=roomid;
                     teacherArr[k]=teacherid;                
            });     
            //获得实践课的教师id跟教室id
            callist.practice.map((v,k)=>{
                     var roomid=  v.cal_room;
                     var teacherid=v.cal_teacher;
                     roomIdArr1[k]=roomid;
                     teacherArr1[k]=teacherid; 
            });
              var classid=(callist.practice)[0].cal_classes;
              //根据班级id获得学生
              sq.equalTo("stu_classes",classid);
              sq.find({useMasterKey:true}).then((student)=>{
                 student.map((v,k)=>{
                           var  stu = {                               
                                        "objectid": v.id,
                                        "name": v.get("stu_name"),
                                        "number": v.get("stu_number"),
                                        "gender":v.get("stu_gender"),
                                        "score":"0",
                                        "times":"0",
                                        "sign":"false"
                                        };
                        stuArr.push(stu);
                 });
             }).then(()=>{   
                //获得教室数组获得校区、教学楼、设备信息，
               rq.containedIn("objectId",roomIdArr);
               rq.find({useMasterKey:true,}).then((room)=>{
                    room.map((v,k)=>{
                            var classroom={
                                        "roomid":v.id,
                                        "building":v.get("cr_teachingbuilding_id"),
                                        "floor":v.get("cr_floor"),
                                        "device_id":v.get("cr_device_id")
                         };
                         roomInArr.push(classroom);
                    })
                }).then(()=>{   
                       //获得老师信息
                         tq.containedIn("objectId",teacherArr);  
                         tq.find({useMasterKey:true}).then((teacher)=>{
                                teacher.map((v,k)=>{
                                        var tea={
                                            "tcherid":v.id,
                                            "number":v.get("tcher_number"),
                                            "gender":v.get("tcher_gender"),
                                            "name":v.get("tcher_name")
                                        };
                                    teacherInArr.push(tea);
                                })
                         }).then(()=>{
                             //插入理论课
                             console.log("dddd");
                             var type="理论";
                            insertcalendar(callist.theory,roomInArr,teacherInArr,stuArr,callist.educationalid,type);     
                            response.success({"status":"success"});                         
                                          
               }).then(()=>{
                        rq1.containedIn("objectId",roomIdArr1);
                        rq1.find({useMasterKey:true,}).then((room1)=>{
                        room1.map((v,k)=>{
                                var classroom={
                                            "roomid":v.id,
                                            "building":v.get("cr_teachingbuilding_id"),
                                            "floor":v.get("cr_floor"),
                                            "device_id":v.get("cr_device_id")
                            };
                            roomInArr1.push(classroom);
                        })
                }).then(()=>{
                   
                         tq1.find({useMasterKey:true}).then((teacher1)=>{
                                teacher1.map((v,k)=>{
                                        var tea={
                                            "tcherid":v.id,
                                            "number":v.get("tcher_number"),
                                            "gender":v.get("tcher_gender"),
                                             "name":v.get("tcher_name")
                                        };
                                    teacherInArr1.push(tea);
                                  
                         });
                }).then(()=>{
                    console.log("eeee");
                    var type="实践";
                    insertcalendar(callist.practice,roomInArr1,teacherInArr1,stuArr,callist.educationalid,type);     
                    response.success({"status":"success"});

                }) 
                            })
                        })
                })
})
            }

});