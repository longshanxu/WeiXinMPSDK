//修改calendar的状态为上课中,最后返回updated以后的对象
Parse.Cloud.define('changeCalendarStateInClass', function(request, response) {
    const calendar_objectid = request.params.objectid;//calendar的objectid

    const calendar_query = new Parse.Query("Calendar");

    calendar_query.get(calendar_objectid,{useMasterKey:true}).then((calendar)=>{
        calendar.save({"cal_state":"课中"}).then(
            (calendar)=>{
                response.success(calendar);
            },
            (error)=>{
                response.error(error);
            }
        );
    }).catch((error)=>{
        response.error(error);
    });
});