/**
 * @description 为课程案例下的情景案例增加一个评分规则
 * @author liangwei.xia
 * @since 2018-1-12
 */
function getRandomStr(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

 Parse.Cloud.define("addRatingRulesByPracticeId",(request,response)=>{
    var coursecaseid = request.params.coursecaseid ; //获取课程案例id
    var practicecaseid = request.params.practicecaseid ; //获取情景案例
    var ratingrulelsit = request.params.ratingrule ;//获取评分数组对象
    console.log(practicecaseid);
    var ratingrules = JSON.parse(ratingrulelsit);
    ratingrules.id=getRandomStr(9);//为评分规则加一个id
    console.log(ratingrules);
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        coursecase.get("coursecase_practice").map((v,k)=>{
                    if(v.id==practicecaseid){
                            v.ratingrule.push(ratingrules);
                            coursecase.save().then(()=>{
                                response.success({"code":"200"});
                            }).catch((e)=>{
                                    response.error(e);
                            });                      
                    };
        });
     }).catch((e)=>{
             response.error(e);
     })
 })