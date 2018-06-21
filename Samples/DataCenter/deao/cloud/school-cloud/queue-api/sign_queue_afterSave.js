//签到以后，新增签到对象
var kueapi = require("../../../server/kue_api");
var openid_redis = require("../../../server/openid_redis");
Parse.Cloud.afterSave('StudentSigns',function(request){
    var sign , calendar_id , calendar , classroom_id , classroom , schoolid , student_openid;
    var sign = request.object;
    //通过sign对象中，签到人的学校id、学号去redis中获取该人的openid
    openid_redis.getOpenid(sign.get('ss_school_id'),sign.get('ss_student_number'),(data)=>{
        student_openid = data;
    });
    
    /**
     * 签到学生的信息，签到课程信息，教室信息，
     */
    const calendar_query = new Parse.Query("Calendar");
    const classroom_query = new Parse.Query("ClassRoom");
    
    var teacher_info = {};//教师信息json对象
    var calendar_teachers = [];//calendar中的上课教师

    calendar_id = sign.get('ss_calendar_id');
    classroom_id = sign.get('ss_room_id');

    calendar_query.get(calendar_id,{useMasterKey:true}).then((object_calendar)=>{
        calendar = object_calendar;
        schoolid = calendar.get("cal_school_id");
        calendar_teachers = calendar.get("cal_teacher");

        //根据课程获取到的schoolid，去查询本学校的教师
        const teacher_query = new Parse.Query("Teacher");
        teacher_query.equalTo("tcher_school_id",schoolid);

        return teacher_query.find({useMasterKey:true});
    }).then((objects)=>{

        objects.map((v,k)=>{           
        teacher_info[v.get("tcher_number")] = v.get("tcher_name");
        });
        return classroom_query.get(classroom_id,{useMasterKey:true});
    }).then((object_room)=>{
        classroom = object_room;
        var teachers = [];
        
        calendar_teachers.map((v,k)=>{
            teachers.push(teacher_info[v.number]);
        });

        let queue = {
            "studentName":sign.get('ss_student_name'),
            "studentOpenid":[student_openid],
            "studentNumber":sign.get('ss_student_number'),
            "calendarName":calendar.get('cal_title'),
            "classRoomName":classroom.get('cr_name'),
            "signedTime":sign.get('ss_signs_time').toLocaleString(),
            "calendarTeacher":teachers.toString(),
            "title":'您好，在('+classroom.get('cr_name')+')教室的课程('+calendar.get('cal_title')+')完成了签到！'
        }
        kueapi.doQueue("signok",queue);
    }).catch((e)=>{
        response.error(e);
    });    
});