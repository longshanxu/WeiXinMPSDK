//基于一节课给学生进行分组

var updateQueue = require('../queue-api/update_calendar_queue_function');

Parse
  .Cloud
  .define("groupingByCalendarId", function (request, response) {
      var teamArr = JSON.parse(request.params.teamarr);
      console.log(teamArr);
      console.log(teamArr["teacher-1"]);
      var  Calendar = Parse.Object.extend("Calendar");
      var ClassRoom = Parse.Object.extend("ClassRoom");
      var  cq =  new Parse.Query("Calendar");
      var tq =new Parse.Query("Teacher");
      var teacherArr=[];
      //拿到这个学校所有教师，便于匹配传值
      tq.equalTo("tcher_school_id",teamArr["schoolid"]);
      tq.find({useMasterKey:true}).then((teacher)=>{
                teacher.map((v,k)=>{
                        var tea={
                            "tcherid":v.id,
                            "name":v.get("tcher_name"),
                            "gender":v.get("tcher_gender"),
                            "number":v.get("tcher_number")
                        };
                     teacherArr.push(tea);     
                })
      }).then(()=>{
                //获得当前课程对象
                 cq.get(teamArr.calendarid,{useMasterKey:true}).then((res)=>{

                    return res;

                }).then((res)=>{
                    console.log(res);
                    //获得多个分组信息，把第一个组的信息分配给获得的课程对象，剩下的组按顺序分配到生成的课程对象中
                          var studentArr=[] ;
                          var teacher="";
                          teamArr["stufield-1"].map((v,k)=>{
                         // console.log(v.name);
                                var student1={
                                        "objectid": v.objectid,
                                        "name": v.name,
                                        "number": v.number,
                                        "gender":v.gender,
                                        "score":"0",
                                        "times":"0",
                                        "sign":"false"
                                        };
                                studentArr.push(student1);                                                                
                        });
                        teacherArr.map((v,k)=>{
                               var teaArr=[]; 
                               if(v.tcherid==teamArr["teacher-1"]){
                                       teaArr.push(v);
                                       console.log(teamArr["classroom-1"]);
                                       res.set("cal_teacher",teaArr);
                                       res.set("cal_students",studentArr);
                                       res.set("cal_count",(teamArr["stufield-1"].length).toString());
                                       res.set("cal_room",teamArr["classroom-1"] );
                                       res.set("cal_team_status","无需分组");
                                       res.save({
                                           success:() => {
                                                updateQueue.updateQueue(teamArr["calendarid"]);
                                           },
                                           error:(e)=>{
                                                    response.success(e);
                                           }
                                       });
                               }
                        });
                        //创建剩下组的信息
                            for(var i=0;i<teamArr.groupcount-1;i++){
                                var cal = new Calendar();
                                var j=i+2;
                                var stuArr=[]; 
                                
                                teamArr["stufield-"+j].map((v,k)=>{                                
                                        var student ={
                                        "objectid": v.objectid,
                                        "name": v.name,
                                        "number": v.number,
                                        "gender":v.gender,
                                        "score":"0",
                                        "times":"0",
                                        "sign":"false"
                                        };
                                        stuArr.push(student);

                                });
                                   // console.log(res.get("cal_buildings"));
                                    // console.log(stuArr);                           
                                    var room = new ClassRoom();
                                    room.id=teamArr["classroom-"+j];                            
                                    console.log(teamArr["classroom-"+j]);
                                    teacherArr.map((v,k)=>{
                                    if(v.tcherid==teamArr["teacher-"+j]){
                                            var teaInArr=[];                                         
                                            teaInArr.push(v);
                                            console.log(teaInArr);
                                            cal.set("cal_teacher",teaInArr);
                                        }
                                    });                                 
                                    cal.set("cal_students",stuArr);
                                    cal.set("cal_begin_course",res.get("cal_begin_course"));
                                    cal.set("cal_end_course",res.get("cal_end_course"));
                                    cal.set("cal_section_time",res.get("cal_section_time"));
                                    cal.set("cal_buildings",res.get("cal_buildings"));
                                    cal.set("cal_floor",res.get("cal_floor"));
                                    cal.set("cal_device",res.get("cal_device"));
                                    cal.set("cal_classes",res.get("cal_classes"));
                                    cal.set("cal_content",res.get("cal_content"));
                                    cal.set("cal_course_code",res.get("cal_course_code"));
                                    cal.set("cal_course_type",res.get("cal_course_type"));
                                    cal.set("cal_date",res.get("cal_date"));
                                    cal.set("cal_faculty",res.get("cal_faculty"));
                                    cal.set("cal_grade",res.get("cal_grade"));
                                    cal.set("cal_level",res.get("cal_level"));
                                    cal.set("cal_major",res.get("cal_major"));
                                    cal.set("cal_room",teamArr["classroom-"+j]);
                                    cal.set("cal_school_id",res.get("cal_school_id"));
                                    cal.set("cal_term",res.get("cal_term"));
                                    cal.set("cal_title",res.get("cal_title"));
                                    cal.set("cal_total_hours",res.get("cal_total_hours"));
                                    cal.set("cal_week",res.get("cal_week"));
                                    cal.set("cal_count",(teamArr["stufield-"+j].length).toString());
                                    cal.set("cal_section",res.get("cal_section"));
                                    cal.set("cal_semester",res.get("cal_semester"));
                                    cal.set("cal_campus",res.get("cal_campus"));
                                    cal.set("cal_teaching_task",res.get("cal_teaching_task"));
                                    cal.set("cal_room_id",room);
                                    cal.set("cal_state","课前");
                                    cal.save({
                                        success:(cal)=>{
                                            updateQueue.updateQueue(cal.id);
                                            console.log("成功");
                                            cal.set("cal_team_status","无需分组");
                                            cal.save();
                                            response.success({"status":"success"});
                                        },
                                        error:(e)=>{
                                            response.error(e);
                                        }
                                    });                           
                                    console.log(stuArr);
                                    console.log(teamArr["teacher-"+j]);

                            }


                        

                        
                }).catch((e) =>  {
                    response.error(e);
                    });
                   
      
      })
      
     
  });


             