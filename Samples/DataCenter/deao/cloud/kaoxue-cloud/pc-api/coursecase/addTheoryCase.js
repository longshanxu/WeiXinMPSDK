/**
 * @description 为课程案例增加一个课程案例
 * @author liangwei.xia
 * @since 2018-1-10
 */
function getRandomStr(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};//生成一个随机id

 Parse.Cloud.define("addTheoryCase",(request,response)=>{
 
    var coursecaseid = request.params.coursecaseid ; //获取课程案例id
    var coursecaselist= request.params.coursecasearr ; //获取课程案例对象
    var coursecasearr=JSON.parse(coursecaselist);
    var coursecaeQuery = new Parse.Query("CourseCase");
    for(var i=0;i<coursecasearr.length;i++){
        coursecasearr[i].id=getRandomStr(10);//为课程案例加一个id
        coursecasearr[i].ratingrule=[];//重置评分规则
    };
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        var coursecasearr1=coursecase.get("coursecase_theory").concat(coursecasearr);//增加课程案例
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