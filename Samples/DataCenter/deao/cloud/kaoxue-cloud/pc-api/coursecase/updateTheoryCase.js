/**
 * @description 修改一个课程案例
 * @author liangwei.xia
 * @since 2018-1-10
 */

Parse.Cloud.define("updateTheoryCase", (request, response)=>{
    var coursecaseid = request.params.coursecaseid ; //获取课程案例id
 //   var practicecaseid = require.params.practicecaseid;//获取情景案例id
    var theorycaselist =request.params.practicecase; //获取修改后的课程案例对象
    var theorycase = JSON.parse(theorycaselist);
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
        var coursecasearr=coursecase.get("coursecase_theory");
                     coursecasearr.map((v,k)=>{
                            if(theorycase.id==v.id){
                                coursecasearr.remove(v); //移除要修改的对象
                                coursecasearr.push(theorycase); //将新的对象再补上
                                coursecase.save().then(()=>{
                                    response.success({"code":"200"});
                                }).catch((e)=>{
                                                response.error(e);
                                                    
                                        })
                                 
                            };
                })
    })
});