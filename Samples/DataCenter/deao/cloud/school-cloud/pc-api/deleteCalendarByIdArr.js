//根据id数组删除Calendar
Parse.Cloud.define('deleteCalendarByIdArr',(request,response)=>{
    var idarr =request.params.calidarr;
    var calidarr = JSON.parse(idarr);
    console.log(calidarr);
    const Calendar = Parse.Object.extend('Calendar');
    const cq  = new Parse.Query(Calendar);
    cq.containedIn("objectId",calidarr);
    cq.find({useMasterKey:true}).then((cal)=>{
                cal.map((v,k)=>{
                    v.destroy();
                });              
                response.success({"status":"删除成功"});
    }).catch((e)=>{
            response.error(e);
    })
});