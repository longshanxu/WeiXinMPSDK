//检测数组是否包含元素
function containstu(arr,bind_number){
  var i = arr.length;  
    while (i--) {  
        if (arr[i].get("src_student_number") == bind_number) {  
            return true;  
        }  
    }  
    return false; 
}

function containtea(arr,bind_number){
  var i = arr.length;  
    while (i--) {  
        if (arr[i].get("jou_teacher_number") == bind_number) {  
            return true;  
        }  
    }  
    return false; 
}

//获取课程详情信息
Parse.Cloud.define("getScheduleInfoByScheduleid", function(request, response) {
  const bindquery = new Parse.Query("Bindings");
  const query = new Parse.Query("Calendar");
        query.include("cal_room_id");

  const oid = request.params.oid;
  
  var evaluateType = 0;
  var evaluate = false;

  bindquery.equalTo("bind_open_id", oid);
  bindquery.find({useMasterKey: true}).then((results)=>{
    console.log(results);
    let bind_type = results[0].get("bind_type");
    let bind_number = results[0].get("bind_number");
    console.log(bind_type);
    console.log(bind_number);

    if(bind_type == "学生"){
      
      // 学生评价课程
      query.get(request.params.objectid,{ useMasterKey: true }).then((object) => {
          console.log("calendar",object);
                var arr = [];
          object.relation("cal_rating_course").query().count(function(count){
            console.log(count);
              if(count == 0){
                evaluate = false;
                response.success({"evaluate":evaluate,"course":object})
              }else{
                object.relation("cal_rating_course").query().each(function(data){
                  console.log(data);
                  arr.push(data);
                  if(arr.length == count){
                    if(containstu(arr, bind_number) == true){
                      console.log("学生已评价课程");
                      response.success({"evaluate":true,"course":object});
                    }else{
                      console.log("学生未评价课程");
                      response.success({"evaluate":false,"course":object});
                    }
                  }
                  // console.log("arr",arr);
                
                })
              }
            })

          // response.success(object);
        })
        .catch((error) =>  {
          response.error("calendarquery",error);
        });

    }else if (bind_type == "老师") {
      // 老师填写教学日志
      query.get(request.params.objectid,{ useMasterKey: true }).then((object) => {
          console.log("calendar",object);
                var arr = [];
          object.relation("cal_journals").query().count(function(count){
            console.log(count);
              if(count == 0){
                evaluate = false;
                console.log("老师未填写教学日志")
                response.success({"evaluate":evaluate,"course":object})
              }else{
                object.relation("cal_journals").query().each(function(data){
                  console.log(data);
                  arr.push(data);
                  if(arr.length == count){
                    if(containtea(arr, bind_number) == true){
                      console.log("老师已填写教学日志");
                      response.success({"evaluate":true,"course":object});
                    }else{
                      console.log("老师未填写教学日志");
                      response.success({"evaluate":false,"course":object});
                    }
                  }
                  // console.log("arr",arr);
                
                })
              }
            })

          // response.success(object);
        })
        .catch((error) =>  {
          response.error("calendarquery",error);
        });
    }


  }).catch((e)=>{console.log("bindquery:",e)})

});