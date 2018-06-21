//自动修改calendar课程的状态
/**
 * params objectid == calendar的objectid
 */
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
module.exports.lesson_state = function lesson_state (objectid){
    //根据传递过来的objectid，去查询要执行的课程对象
    const calendar_query = new Parse.Query('Calendar');
    calendar_query.get(objectid,{
        success:(calendar)=>{
            let queue_begin = {
                objectid:calendar.id,
                beginTime:calendar.get('cal_begin_course').toLocaleString()
            };
            let queue_end = {
                objectid:calendar.id,
                beginTime:calendar.get('cal_end_course').toLocaleString()
            };

            kueapi.delayReQueue('lesson_begin',new Date(queue_begin.beginTime),queue_begin,(jobId)=>{
                redis.setCode(calendar.id+':lesson_begin',jobId);
            });

            kueapi.delayReQueue('lesson_end',new Date(queue_end.beginTime),queue_end,(jobId)=>{
                redis.setCode(calendar.id+':lesson_end',jobId);
            });
        },
        error:(e)=>{
            console.error(e)
        },
        useMasterKey:true
    });
}