//根据id删除Calendar
const logUtil = require('../../../../logger.js');

Parse.Cloud.define('deleteCalendarById',(request,response)=>{
    var id =request.params.calid;
    
    const Calendar = Parse.Object.extend('Calendar');
    const cq  = new Parse.Query(Calendar);
    cq.get(id,{useMasterKey:true}).then((cal)=>{
        cal.destroy();
        response.success({"status":"删除成功"});
    }).catch((e)=>{
        response.error(e);
        logUtil.logError(e, request);
    })
});