/**
 * @description 获得所有课程案例
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("getAllCourseCase",(request,response)=>{
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.find({useMasterKey:true}).then((coursecase)=>{
        response.success(coursecase);//获得所有课程案例
    }).catch((e)=>{
            response.error(e);
    })
 })