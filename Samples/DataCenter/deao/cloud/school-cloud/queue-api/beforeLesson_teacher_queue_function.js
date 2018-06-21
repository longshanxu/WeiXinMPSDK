//老师的课前提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
/**
 * params objectId -- calendar's objectId
 */
module.exports.beforeLesson_teacher = function beforeLesson_teacher(objectId){
    var calendar_object, school_id;
    const calendar_query = new Parse.Query("Calendar");//calendar query
    calendar_query.include('cal_room_id');

    calendar_query.get(objectId).then((calendar)=>{
        calendar_object = calendar;
        school_id = calendar.get("cal_school_id");
        var teachers = [];//把calendar里面的教师遍历出来，放入其中number
        var teachers_name = [];//老师名称
        var tea = calendar_object.get('cal_teacher');
        tea.map((v,k)=>{
            teachers.push(v.number);
            teachers_name.push(v.name);
        });
        //queue提醒的时间，提前十分钟发出。设置提醒时间
        var course_begin_time =  calendar_object.get('cal_begin_course');
        var begin_time = new Date (course_begin_time.valueOf()-(10*60*1000));
        
        let queue = {
            'objectId':calendar_object.id,
            'schoolid':school_id,
            'courseName': calendar_object.get('cal_title'),
            'courseContent':calendar_object.get('cal_content'),
            'teachers': teachers,
            'teachersName':teachers_name,
            'classroom': calendar_object
                .get('cal_room_id')
                .get('cr_name'),
            'courseTime':calendar_object.get('cal_begin_course').toLocaleString(),
            'beginTime': begin_time.toLocaleString(),
            'title': '本次课程即将开始！'
        };
        kueapi.delayReQueue('beforeLesson_teacher',new Date(queue.beginTime),queue,(jobId)=>{
            redis.setCode(queue.objectId+':beforeLesson_teacher',jobId);
        });        

    }).catch((e)=>{
        console.log(e);
    });   
}