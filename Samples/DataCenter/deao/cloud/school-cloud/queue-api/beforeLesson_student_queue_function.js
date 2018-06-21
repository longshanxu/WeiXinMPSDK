//学生的课前提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
/**
 * params objectId - calendar objectId
 */
module.exports.beforeLesson_student =function beforeLesson_student(objectId){
    var calendar_object, school_id ;
    const calendar_query = new Parse.Query("Calendar");//calendar query
    calendar_query.include('cal_room_id');

    calendar_query.get(objectId).then((calendar)=>{
        calendar_object = calendar;
        school_id = calendar.get("cal_school_id");

        var stu = [];//放本节课所有学生的number
        var students = calendar_object.get('cal_students');//每节课中的学生
        students.map((v,k)=>{
            stu.push(v.number);
        });

        var tea = [];//放本节课的上课教师
        var teachers = calendar_object.get('cal_teacher');
        teachers.map((v,k)=>{
            tea.push(v.name);
        });
        //queue提醒的时间，提前十分钟发出。设置提醒时间
        var course_begin_time =  calendar_object.get('cal_begin_course');
        var begin_time = new Date (course_begin_time.valueOf()-(10*60*1000));
        
        let queue = {
            'objectId':calendar_object.id,
            'schoolid':school_id,
            'courseName':calendar_object.get('cal_title'),
            'courseContent':calendar_object.get('cal_content'),
            'teachers':tea.toString(),
            'classroom':calendar_object.get('cal_room_id').get('cr_name'),
            'courseTime':calendar_object.get('cal_begin_course').toLocaleString(),
            'beginTime':begin_time.toLocaleString(),//提醒执行时间
            'students':stu,
            'title':'本次课程即将开始！'
        };
        kueapi.delayReQueue('beforeLesson_student',new Date(queue.beginTime),queue,(jobId)=>{
            redis.setCode(queue.objectId+':beforeLesson_student',jobId);
        }); 
    }).catch((e)=>{
        console.log(e);
    });

}