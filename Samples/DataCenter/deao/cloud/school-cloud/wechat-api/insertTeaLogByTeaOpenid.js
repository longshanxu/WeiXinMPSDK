// 老师填写教学日志
Parse
  .Cloud
  .define("insertTeaLogByTeaOpenid", function (request, response) {
    //参数--老师的open ID，打分，评价内容，课objectid
    const openid = request.params.oid;//openid
    const calendar_objectid = request.params.calendarobjectid; //课的objectid

    const score = request.params.score; //老师对课的评分
    const content = request.params.content;
    var teacherName = "";
    var teacherObjectid = "";
    
    console.log(openid);
    console.log(calendar_objectid);
    console.log(score);
    console.log(content);

    var bindquery = new Parse.Query("Bindings");
    var teacherquery = new Parse.Query("Teacher");
    var calendarquery = new Parse.Query("Calendar");
    var TeachingLogsave = Parse.Object.extend("Journals");

    console.log("start");
    bindquery.equalTo("bind_open_id",openid);
    bindquery.find({useMasterKey:true}).then((results)=>{   // 查询绑定表
      console.log(results);
      var bind_number = results[0].get("bind_number");
      var bind_school_id = results[0].get("bind_school_id");

      
      teacherquery.equalTo("tcher_number",bind_number);
      teacherquery.equalTo("tcher_school_id",bind_school_id);
      teacherquery.find({useMasterKey:true}).then((res)=>{    // 查询学生表
        teacherObjectid = res[0].id;
        // teacherName = res[0].get("stu_name");

        calendarquery.get(calendar_objectid,{useMasterKey:true}).then((object)=>{   // 查询calendar表
          console.log(object);

          var TeachingLog = new TeachingLogsave();    // 老师填写教学日志  插入数据
          TeachingLog.set("jou_calendar_id",object.id);
          TeachingLog.set("jou_teacher_id", teacherObjectid);
          TeachingLog.set("jou_matters", score+"");
          TeachingLog.set("jou_content", content);
          TeachingLog.set("jou_teacher_number", bind_number);
          TeachingLog.save(null,{
            success:function(TeachingLog){
   
              object.relation("cal_journals").add(TeachingLog);
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
        response.error("teacherquery:",e)
      })

    }).catch((e)=>{
      response.error("bindquery:",e)
    })

    

  });