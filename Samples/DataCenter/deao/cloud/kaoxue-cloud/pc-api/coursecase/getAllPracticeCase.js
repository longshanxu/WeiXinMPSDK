/**
 * @description 获得课程案例下的情景案例
 * @author liangwei.xia
 * @since 2018-1-10
 */
Parse.Cloud.define("getAllPracticeCase",(request,response)=>{
    console.log("abc");
    var coursecaseid = request.params.coursecaseid  //获取课程案例id
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        response.success(coursecase.get("coursecase_practice"));//获得课程案例下的情景案例
    }).catch((e)=>{
            response.error(e);
    })
 })