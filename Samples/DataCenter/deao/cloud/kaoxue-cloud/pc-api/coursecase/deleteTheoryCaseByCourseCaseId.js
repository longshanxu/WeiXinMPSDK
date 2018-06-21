/**
 * @description 删除课程案例下的课程案例
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("deleteTheoryCaseByCourseCaseId",(request,response)=>{
    var coursecaseid = request.params.coursecaseid; //获取课程案例id
    var theorycaseid = request.params.theorycaseid;//获取要删除的课程案例id
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        var theorycasearr =coursecase.get("coursecase_theory"); 
        theorycasearr.map((v,k)=>{
                if(theorycaseid == v.id){
                    theorycasearr.splice(k,1);//删除指定id的课程案例
                    coursecase.save().then((e)=>{
                        response.success({"code":"200"});
                    }).catch((e)=>{
                            response.error(e);
                    })            
                }
        })
    }).catch((e)=>{
        response.error(e);
    })

})