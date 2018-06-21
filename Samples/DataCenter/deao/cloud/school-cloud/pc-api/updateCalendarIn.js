//在PC端，在日历图中调整拖动课程，触发的函数
var updateCalendarQueue = require('../queue-api/update_calendar_queue_function');
const logUtil = require('../../../../logger.js');

Parse.Cloud.define('updatecalendarin',(request,response)=>{
    const Calendar = Parse.Object.extend('Calendar');
    var calendar = new Calendar();

    calendar.save(request.params,{
        success:(object)=>{
            updateCalendarQueue.updateQueue(object.id);
            response.success(object);
            logUtil.logResponse(request,object);
        },
        error:(e)=>{
            response.error(e);
        }
    });
});