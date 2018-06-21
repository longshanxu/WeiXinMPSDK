/**
 * 变更课程后，重置有关该课程的所有提醒
 */
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
var lesson_state = require('./lesson_state_queue_function');
var beforeLesson_24hours = require('./beforeLesson_24hours_queue_function');
var beforeLesson_student_function = require('./beforeLesson_student_queue_function');
var afterLesson_student_function = require('./afterLesson_student_queue_function');
var beforeLesson_teacher_function = require('./beforeLesson_teacher_queue_function');
var afterLesson_teacher_function = require('./afterLesson_teacher_queue_function');

/**
 * objectId  --  calendar的objectid
 */
module.exports.updateQueue = function updateQueue(objectId){
    //课前，课后的学生，老师的queue的id
    var before_24hours_queue_id , lesson_begin_queue_id , lesson_end_queue_id , before_student_queue_id , after_student_queue_id , before_teacher_queue_id , after_teacher_queue_id;

    const calendar_query = new Parse.Query('Calendar');
    calendar_query.include('cal_room_id');
    /**
     * 1.通过redis中缓存的每个calendar的提醒ID，查到ID后，清除提醒
     */
    redis.getCode(objectId+':beforeLesson_24hours',(data)=>{
        before_24hours_queue_id = data;
        if(null != before_24hours_queue_id){
            kueapi.deleteQueueById(before_24hours_queue_id,'beforeLesson_24hours');
            redis.deleteCode(objectId+':beforeLesson_24hours',(data)=>{});
        }
            
    });

    redis.getCode(objectId+':lesson_begin',(data)=>{
        lesson_begin_queue_id = data;
        if(null != lesson_begin_queue_id){
            kueapi.deleteQueueById(lesson_begin_queue_id,'lesson_begin');
            redis.deleteCode(objectId+':lesson_begin',(data)=>{});
        }
            
    });

    redis.getCode(objectId+':lesson_end',(data)=>{
        lesson_end_queue_id = data;
        if(null != lesson_end_queue_id){
            kueapi.deleteQueueById(lesson_end_queue_id,'lesson_end');
            redis.deleteCode(objectId+':lesson_end',(data)=>{});
        }
            
    });

    redis.getCode(objectId+':beforeLesson_student',(data)=>{
        before_student_queue_id = data;
        if(null != before_student_queue_id){
            kueapi.deleteQueueById(before_student_queue_id,'beforeLesson_student');
            redis.deleteCode(objectId+':beforeLesson_student',(data)=>{});
        }
            
    });
    redis.getCode(objectId+':afterLesson_student',(data)=>{
        after_student_queue_id = data;
        if(null != after_student_queue_id){
            kueapi.deleteQueueById(after_student_queue_id,'afterLesson_student');
            redis.deleteCode(objectId+':afterLesson_student',(data)=>{});
        }
            
    });
    redis.getCode(objectId+':beforeLesson_teacher',(data)=>{
        before_teacher_queue_id = data;
        if(null != before_teacher_queue_id){
            kueapi.deleteQueueById(before_teacher_queue_id,'beforeLesson_teacher');
            redis.deleteCode(objectId+':beforeLesson_teacher',(data)=>{});
        }
            
    });
    redis.getCode(objectId+':afterLesson_teacher',(data)=>{
        after_teacher_queue_id = data;
        if(null != after_teacher_queue_id){
            kueapi.deleteQueueById(after_teacher_queue_id,'afterLesson_teacher');
            redis.deleteCode(objectId+':afterLesson_teacher',(data)=>{});
        }
            
    });
    /**
     * 2.根据新传入calendar objectid，新建提醒
     */
    lesson_state.lesson_state(objectId);
    beforeLesson_24hours.beforeLesson_24hours(objectId);
    beforeLesson_student_function.beforeLesson_student(objectId);
    afterLesson_student_function.afterLesson_student(objectId);
    beforeLesson_teacher_function.beforeLesson_teacher(objectId);
    afterLesson_teacher_function.afterLesson_teacher(objectId);

}