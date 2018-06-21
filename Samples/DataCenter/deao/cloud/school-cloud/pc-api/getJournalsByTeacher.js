//获取某个教师的教学日志信息，包括已填写跟未填写

function array_remove_repeat(a) { // 去重
    console.log("wei",a);
    var r = [];
    for(var i = 0; i < a.length; i ++) {
        var flag = true;
        var temp = a[i];
        for(var j = 0; j < r.length; j ++) {
            if(temp === r[j]) {
                flag = false;
                break;
            }
        }
        if(flag) {
            r.push(temp);
        }
    }
    return r;
};

function array_difference(a, b) { // 差集 a - b
    //clone = a
    console.log("a",a);
    console.log("b",b);
    var clone = a.slice(0);
    console.log("clone",clone);
    for(var i = 0; i < b.length; i ++) {
        var temp = b[i];
        for(var j = 0; j < clone.length; j ++) {
            if(temp === clone[j]) {
                //remove clone[j]
                clone.splice(j,1);
            }
        }
    }
    return array_remove_repeat(clone);
};
Parse
  .Cloud
  .define("getJournalsByTeacher", function (request, response) {
    var  teacherid = request.params.teacherid; //教师的objectID
    var  schoolid=request.params.schoolid; //学校的objectID
    console.log(teacherid);
    console.log(schoolid);
    var Journals = Parse.Object.extend("Journals");
    var cal = Parse.Object.extend("Calendar");
    var tea =Parse.Object.extend("Teacher");
    var cq = new Parse.Query(cal);
    var cq1 =new Parse.Query(cal);
    var jou = new Parse.Query(Journals);
    var jou1= new Parse.Query(Journals);
    var tq =  new Parse.Query(tea);
    var calInArr =[];//存储根据教师number查询的课程信息
    var  jouInArr=[];//存储已查询出来的教学日志的课程id
     var  journals=[];//用于存储根据教师id查询得教学日志信息
     var joulist=[];
     var  journal={
            "calId":"",
            "content":"",
            "ratings":"",
            "matters":"",
            "calendar":{},
    };//存储教学日志中的信息
     var  journal1={
            "calId":"",
            "content":"",
            "ratings":"",
            "matters":"",
            "calendar":{},
    };//存储已查询的calendar信息
    tq.get(teacherid,{useMasterKey:true}).then((teacher)=>{
            console.log(teacher);
            var   number  = teacher.get("tcher_number");
            return number;//根据教师id的到教师number
    }).then((number)=>{
          //根据number查询所有课程信息
          cq.containedIn("cal_teacher.number",[number]);
          cq.equalTo("cal_state","课后");
          cq.find({
                useMasterKey:true,
                success:(cal)=>{
                // console.log(cal);                                         
                    cal.map((v,k)=>{
                       var  journal1={
                                        "calId":"",
                                        "content":"",
                                        "ratings":"",
                                        "matters":"",
                                        "calendar":{},
                                };//临时变量
                            journal1.calId=v.id;
                            journal1.calendar=v;
                            calInArr.push(journal1);                                                
                    });    
                  console.log("课程数组：",calInArr);
                }             
          }).then(()=>{
          // console.log(calInArr);
          //跟据日志获得jou_calendar_id数组
          jou.equalTo("jou_school_id",schoolid);
          jou.equalTo("jou_teacher_id",teacherid);
           jou
              .find({
                    useMasterKey:true,
                    success:function(res){
                        console.log("res:",res);
                        res.map((v,k)=>{
                            
                            var  journal={
                                    "content":v.get("jou_content"),
                                    "ratings":v.get("jou_student_rating"),
                                    "matters":v.get("jou_matters"),
                                    "calId":v.get("jou_calendar_id"),
                                    "calendar":{},
                            };          
                            journals.push(journal);
                            jouInArr.push(v.get("jou_calendar_id"));
                        })
                        console.log("jouInArr:",jouInArr);
                    },
                    error(e){
                        response.error(e);
                    }
                })
                  .then(() => {  
                              console.log("jouid:",jouInArr);
                              console.log("calInArr:",calInArr);
                              var calIds=[]
                              for(var i=0;i<calInArr.length;i++){
                                        calIds.push(calInArr[i].calId);
                              };
                            //   console.log(calIds);
                            //   var ids=array_difference(calIds, jouInArr);
                            //   console.log("xia",ids);
                              //console.log(ids);
                              return calIds;
                            
                      }).then((calIds)=>{
                        //   console.log(joulist);
                          console.log(calIds);
                          cq1.containedIn("objectId",calIds);
                          cq1.find({useMasterKey:true}).then((cals)=>{
                              console.log("calids:",cals);
                                    cals.map((v,k)=>{
                                        var  journal2={
                                                "content":"",
                                                 "ratings":"",
                                                 "matters":"",
                                                 "calId":v.id,
                                                 "calendar":v,
                                        };
                                         joulist.push(journal2);
                                    })
                           })
                        //.then(()=>{
                        //         console.log("joulist:",joulist);
                        //         if(joulist.length>0){
                        //                 for(var i=0;i<joulist.length;i++){
                        //                 var journals = new Journals();
                        //                 journals.set("jou_calendar_id",joulist[i].calId);
                        //                 journals.set("jou_teacher_id",teacherid);
                        //                 journals.set("jou_school_id",schoolid);
                        //                 journals.set("jou_teacher_number",number);
                        //                 journals.save();
                        //         }
                        //     }
                               
                             
                        //   })
                        .then(()=>{
                                jou1.equalTo("jou_school_id",schoolid);
                                jou1.equalTo("jou_teacher_id",teacherid);
                                jou1.include("jou_teacher");
                                jou1.include("jou_school");
                                jou1.find({useMasterKey:true}).then((res)=>{
                                    console.log("ressss:",res);
                                    var journals4=[];
                                    res.map((v,k)=>{
                                        var journals3={
                                            "jou_calendar_id": v.get("jou_calendar_id"),
                                            "jou_teacher_id": v.get("jou_teacher_id"),
                                            "jou_matters":v.get("jou_matters"),
                                            "jou_content":v.get("jou_content"),
                                            "jou_teacher_number":v.get("jou_teacher_number"),
                                            "createdAt": v.createdAt,
                                            "updatedAt": v.updatedAt,
                                            "jou_student_rating": v.get("jou_student_rating"),
                                            "jou_school_id": v.get("jou_school_id"),
                                            "objectId": v.id,
                                            "teacher":v.get("jou_teacher").get("tcher_name"),
                                            "school":v.get("jou_school").get("school_name"),                               
                                        }
                                        journals4.push(journals3);
                                    })
                                        console.log("日志：", journals4);
                                        response.success(journals4);
                                })
                          })
                         
                       
                       })
                
                 })
              })
     
     });
            



