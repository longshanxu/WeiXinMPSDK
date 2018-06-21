//老师的课后提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
/**
 * params objectId -- calendar's objectId
 */
module.exports.afterLesson_teacher = function afterLesson_teacher(objectId){
    var calendar_object, school_id;
    const calendar_query = new Parse.Query("Calendar");//calendar query
    calendar_query.include('cal_room_id');
    
    calendar_query.get(objectId).then((calendar)=>{
        calendar_object = calendar;
        school_id = calendar.get("cal_school_id");
        var teachers = [];//把calendar里面的教师遍历出来，放入其number
        var teachers_name = [];//老师名称
        var tea = calendar_object.get('cal_teacher');
        tea.map((v,k)=>{
            teachers.push(v.number);
            teachers_name.push(v.name);
        });
        //课后，延迟五分钟提醒结束课程
        var begin_time = new Date (calendar_object.get('cal_end_course').valueOf() + (5*60*1000));
        
        let queue = {
            'objectId':calendar_object.id,
            'schoolid':school_id,
            'courseName': calendar_object.get('cal_title'),
            'courseContent':calendar_object.get('cal_content'),
            'teachers': teachers,
            'classroom': calendar_object
                .get('cal_room_id')
                .get('cr_name'),
            'courseTime':calendar_object.get('cal_end_course').toLocaleString(),
            'beginTime': begin_time.toLocaleString(),
            'title': '点击详情评价本次课程'
        };
        kueapi.delayReQueue('afterLesson_teacher',new Date(queue.beginTime),queue,(jobId)=>{
            redis.setCode(queue.objectId+':afterLesson_teacher',jobId);
        }); 
    }).catch((e)=>{
        console.log(e);
    }); 
 
}