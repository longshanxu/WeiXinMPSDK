//签到后的状态提醒
Parse.Cloud.define('signQueue', (request, response) => {
    const sign_query = new Parse.Query("StudentSigns");
    //parse server 会监听签到表，然后会把新加入的签到信息，一条一条的发送到这里
    /**
     * 签到学生的信息，签到课程信息，教室信息，
     */
    const calendar_query = new Parse.Query("Calendar");
    const classroom_query = new Parse.Query("ClassRoom");
    var sign , calendar_id , calendar , classroom_id , classroom ;
    sign_query.get('3iRGbIG0PI',{useMasterKey:true}).then((object)=>{
        sign = object;
        console.log("sign",sign);
        calendar_id = sign.get('ss_calendar_id');
        classroom_id = sign.get('ss_room_id');

        return calendar_query.get(calendar_id,{useMasterKey:true});
    }).then((object_calendar)=>{
        calendar = object_calendar;
        console.log("calendar",calendar);
        return classroom_query.get(classroom_id,{useMasterKey:true});
    }).then((object_room)=>{
        classroom = object_room;
        console.log("classroom",classroom);
        let queue = {
            "studentName":sign.get('ss_student_name'),
            "studentOpenid":sign.get('ss_student_openid'),
            "studentNumber":sign.get('ss_student_number'),
            "calendarName":calendar.get('cal_title'),
            "classRoomName":classroom.get('cr_name'),
            "signedTime":sign.get('ss_sign_time'),
            "title":'您好，在('+classroom.get('cr_name')+')教室的课程('+calendar.get('cal_title')+')完成了签到！'
        }

        response.success(queue);
    }).catch((e)=>{
        response.error(e);
    });
});
