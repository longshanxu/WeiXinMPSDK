/**
 * @description 删除课程案例下的情景案例
 * @author liangwei.xia
 * @since 2018-1-11
 */

Parse.Cloud.define("deletePracticeCaseByCourseCaseId",(request,response)=>{
    console.log("avxcc");
    var coursecaseid = request.params.coursecaseid; //获取课程案例id
    var practicecaseid = request.params.practicecaseid;//获取要删除的情景案例id
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        var practicecasearr =coursecase.get("coursecase_practice"); 
        practicecasearr.map((v,k)=>{
                if(practicecaseid == v.id){
                    practicecasearr.splice(k,1);//删除指定id的情景案例
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