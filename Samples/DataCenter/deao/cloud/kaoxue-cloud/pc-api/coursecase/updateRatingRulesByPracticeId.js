/**
 * @description 为课程案例下的情景案例修改一个评分规则
 * @author liangwei.xia
 * @since 2018-1-10
 */

 Parse.Cloud.define("updateRatingRulesByPracticeId",(request,response)=>{
         console.log("xia");
    var coursecaseid = request.params.coursecaseid ; //获取课程案例id
    var practicecaseid = request.params.practicecaseid ; //获取情景案例
    //var ratingruleid = request.params.ratingruleid ;
    var ratingrulelist = request.params.ratingrule ;//获取评分数组对象
    var ratingrules = JSON.parse(ratingrulelist);
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        coursecase.get("coursecase_practice").map((v,k)=>{
                console.log(v);
                if(v.id==practicecaseid){
                    var ratingrulearr=v.ratingrule;
                    ratingrulearr.map((v,j)=>{
                                if(v.id==ratingrules.id){
                                    ratingrulearr.splice(k,1); //移除要修改的对象
                                    ratingrulearr.push(ratingrules); //将新的对象再补上
                                    coursecase.save().then(()=>{
                                        response.success({"code":"200"});
                                    }).catch((e)=>{
                                            response.error(e);
                                    });   
                               }
                        })
                }                 
        });
     }).catch((e)=>{
             response.error(e);
     })
 })