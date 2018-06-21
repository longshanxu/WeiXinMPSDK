/**
 * @description 为课程案例增加一个情景案例
 * @author liangwei.xia
 * @since 2018-1-10
 */
function getRandomStr(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

 Parse.Cloud.define("addPracticeCase",(request,response)=>{
     console.log("xia");
    var coursecaseid = request.params.coursecaseid ; //获取课程案例id
    var coursecaselist = request.params.coursecasearr ; //获取情景案例对象
    var coursecasearr=JSON.parse(coursecaselist);
    var coursecaeQuery = new Parse.Query("CourseCase");
    //console.log(coursecasearr);
    coursecasearr.map((v,k)=>{
            v.id=getRandomStr(10);//为每个情景案例加一个唯一id
            v.ratingrule=[];//重置评分规则
    });
    console.log(coursecasearr);
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        console.log(coursecase.get("coursecase_practice"));
        var coursecasearr1=coursecase.get("coursecase_practice").concat(coursecasearr);//增加情景案例
        coursecase.set("coursecase_practice",coursecasearr1);
        coursecase.save().then(()=>{
            response.success({"code":"200"});
        }).catch((e)=>{
                response.error(e);
        });
     }).catch((e)=>{
             response.error(e);
     })
 })