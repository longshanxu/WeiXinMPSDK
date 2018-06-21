//学生的课后提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
/**
 * params objectId - calendar objectId
 */
module.exports.afterLesson_student =function afterLesson_student(objectId){
    var calendar_object, school_id ;
    const calendar_query = new Parse.Query("Calendar");//calendar query
    calendar_query.include('cal_room_id');
    
    const bind_query = new Parse.Query("Bindings");// bind query
    
    bind_query.equalTo("bind_type","学生");
    var bind_student_info = {};//绑定表中某一学校所有的绑定的学生

    var queue_array = [];//队列信息数组
    calendar_query.get(objectId).then((calendar)=>{
        calendar_object = calendar;
        school_id = calendar.get("cal_school_id");

        var students = calendar_object.get('cal_students');//每节课中的学生
        var stu = [];//放本节课所有学生的学号
        students.map((v,k)=>{
            stu.push(v.number);     
        });

        var tea = [];//放本节课的上课教师
        var teachers = calendar_object.get('cal_teacher');
        teachers.map((v,k)=>{
            tea.push(v.name);
        });
        //queue提醒的时间，课后五分钟发出。设置提醒时间
        var begin_time = new Date (calendar_object.get('cal_end_course').valueOf() + (5*60*1000));
        

        let queue = {
            'objectId':calendar_object.id,
            'schoolid':school_id,
            'courseName':calendar_object.get('cal_title'),
            'courseContent':calendar_object.get('cal_content'),
            'teachers':tea.toString(),
            'classroom':calendar_object.get('cal_room_id').get('cr_name'),
            'courseTime':calendar_object.get('cal_end_course').toLocaleString(),
            'beginTime':begin_time.toLocaleString(),
            'students':stu,
            'title':'点击详情评价本次课程'
        };
        kueapi.delayReQueue('afterLesson_student',new Date(queue.beginTime),queue,(jobId)=>{
            redis.setCode(queue.objectId+':afterLesson_student',jobId);
        }); 

    }).catch((e)=>{
        console.log('bad things in file afterLesson_student_queue_function',e);
    });

}