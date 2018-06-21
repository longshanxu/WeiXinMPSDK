/**
 * @description 删除课程案例
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("deleteCourseCaseById",(request,response)=>{
    var coursecaseid = request.params.coursecaseid; //获取课程案例id
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        coursecase.destroy().then(()=>{
            response.success({"code":"200"});     
        }) .catch((e)=>{
            response.error(e);
        });
    }).catch((e)=>{
        response.error(e);
    })

})