
Parse.Cloud.define("getTeachingHours", function(request, response) {
var Calendar =  Parse.Object.extend("Calendar");
var ClassRoom = Parse.Object.extend("ClassRoom");
var qcal = new Parse.Query(Calendar);//查询课程
var qcal1 = new Parse.Query(Calendar);//查询课程
var qcr= new Parse.Query(ClassRoom);//查询教室
var roomid = request.params.roomid;
var calid = request.params.calendarid;
var course_code;
var school_id;
qcal.get(calid,{
     success: function(cal) {
      course_code = cal.get("cal_course_code");  
     },
     error: function(e){
      response.error(e);
     },
     useMasterKey: true
   }).then(()=>{
      qcr.get(roomid,{
        success: function(cr) {                      
          school_id = cr.get("cr_school_id");
        },
        error: function(e){
          response.error(e);
        },
        useMasterKey: true
   }).then(()=>{
     console.log(course_code);
     console.log(school_id);

      qcal1.equalTo("cal_course_code",course_code);
      qcal1.equalTo("cal_school_id",school_id);
      qcal1.equalTo("cal_state","课后");
      qcal1.find({
        success:function(calendar){
            var  endhours= calendar.length*2;
            console.log("endhours",endhours);
            response.success({"endhours":endhours});
        },
        error: function(e){
          response.error(e);
        },
        useMasterKey: true
      })


   });
});

});