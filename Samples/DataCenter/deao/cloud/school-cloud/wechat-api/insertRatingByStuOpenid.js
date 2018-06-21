// 学生评价课程(老师)
var moment = require('moment');
moment.locale('zh-cn');
Parse
  .Cloud
  .define("insertRatingByStuOpenid", function (request, response) {
    //参数--学生的open ID，打分，评价内容，课objectid
    const openid = request.params.oid;//openid
    const calendar_objectid = request.params.calendarobjectid; //课的objectid

    const score = request.params.score; //学生对课的评分
    const content = request.params.content;
    var studentName = "";
    var studentObjectId = "";
    
    // console.log(openid);
    // console.log(calendar_objectid);
    // console.log(score);
    // console.log(content);

    var bindquery = new Parse.Query("Bindings");
    var studentquery = new Parse.Query("Student");
    var calendarquery = new Parse.Query("Calendar");
    var RatingCoursesave = Parse.Object.extend("StudentRatingCourse");
    console.log("start");
    bindquery.equalTo("bind_open_id",openid);
    bindquery.find({useMasterKey:true}).then((results)=>{   // 查询绑定表
      var bind_number = results[0].get("bind_number");
      var bind_school_id = results[0].get("bind_school_id");

      console.log(bind_number);
      studentquery.equalTo("stu_number",bind_number);
      studentquery.equalTo("stu_school_id",bind_school_id);
      studentquery.find({useMasterKey:true}).then((res)=>{    // 查询学生表
        console.log("res:",res);
        studentObjectId = res[0].id;
        studentName = res[0].get("stu_name");

        calendarquery.get(calendar_objectid,{useMasterKey:true}).then((object)=>{   // 查询calendar表


          var RatingCourse = new RatingCoursesave();    // 学生评价课程  插入数据
          RatingCourse.set("src_calendar_id",object.id);
          RatingCourse.set("src_teacher_id",(object.get("cal_teacher"))[0].tcherid);
          RatingCourse.set("src_teacher_name",(object.get("cal_teacher"))[0].name);
          RatingCourse.set("src_student_number", bind_number);
          RatingCourse.set("src_school_id", bind_school_id);
          RatingCourse.set("src_student_name", studentName);
          RatingCourse.set("src_student_id", studentObjectId);
          RatingCourse.set("src_value", score+"");
          RatingCourse.set("src_content", content);
          RatingCourse.save(null,{
            success:function(RatingCourse){
   
              object.relation("cal_rating_course").add(RatingCourse);
              object.save(null,{
                success:function(object){
                  response.success({"status": "success"});
                },
                error:function(object,e){
                  response.error("object",object,e)
                },
                useMasterKey: true
              })

            },
            error:function(e){
              response.error(e)
            },
            useMasterKey: true
          })

        }).catch((e)=>{
          response.error("calendarquery:",e)
        })

      }).catch((e)=>{
        response.error("studentquery:",e)
      })

    }).catch((e)=>{
      response.error("bindquery:",e)
    })

    

  });