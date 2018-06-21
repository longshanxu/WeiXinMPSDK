/**
 * @description 删除课程(理论)案例的评分规则
 * @author liangwei.xia
 * @since 2018-1-11
 */

Parse.Cloud.define("deleteRatingRuleByPracticeId",(request,response)=>{
    var coursecaseid = request.params.coursecaseid; //获取课程案例id
    var theorycaseid = request.params.theorycaseid;//获取课程（理论）案例id
    var ratingruleid = request.params.ratingruleid;//获取评分规则id
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        var theorycasearr =coursecase.get("coursecase_theory"); 
        theorycasearr.map((v,k)=>{
                if(theorycaseid == v.id){
                    var ratingrules = v.ratingrule;
                    ratingrules.map((v,k)=>{
                            if(v.id==ratingruleid){
                                ratingrules.splice(k,1);//删除指定id的评分规则
                                coursecase.save().then((e)=>{
                                    response.success({"code":"200"});
                                }).catch((e)=>{
                                        response.error(e);
                                })      
                            }
                    })                                 
                }
        })
    }).catch((e)=>{
        response.error(e);
    })

})