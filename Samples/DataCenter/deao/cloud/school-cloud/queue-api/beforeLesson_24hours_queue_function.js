//提前一天的课程提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");

/**
 * params objectId - calendar objectId
 */
module.exports.beforeLesson_24hours = function beforeLesson_24hours(objectId){
    var calendar_object, school_id ;
    const calendar_query = new Parse.Query("Calendar");//calendar query
    calendar_query.include('cal_room_id');
    

    calendar_query.get(objectId).then((calendar)=>{
        calendar_object = calendar;
        school_id = calendar.get("cal_school_id");
        var members = [];//放本节课所涉及到的老师、学生的number
        var students = calendar_object.get('cal_students');//每节课中的学生
        students.map((v,k)=>{
            members.push(v.number);
        });

        var teachers = calendar_object.get('cal_teacher');
        teachers.map((v,k)=>{
            members.push(v.number);
        }); 
        //queue提醒的时间，提前一天发出。设置提醒时间
        var course_begin_time =  calendar_object.get('cal_begin_course');
        var begin_time = new Date (course_begin_time.valueOf()-(24*60*60*1000));

        let queue = {
            'objectId':calendar_object.id,
            'schoolid':school_id,
            'courseName':calendar_object.get('cal_title'),
            'courseContent':calendar_object.get('cal_content'),
            'classroom':calendar_object.get('cal_room_id').get('cr_name'),
            'courseTime':calendar_object.get('cal_begin_course').toLocaleString(),
            'beginTime':begin_time.toLocaleString(),//提醒执行时间
            'members':members,//提醒的成员openid数组
            'title':'《'+calendar_object.get('cal_title')+'》课程安排在一天后进行！'
        };

        kueapi.delayReQueue('beforeLesson_24hours',new Date(queue.beginTime),queue,(jobId)=>{
            redis.setCode(queue.objectId+':beforeLesson_24hours',jobId);
        });        
    }).catch((e)=>{
        console.log(e);
    });
}