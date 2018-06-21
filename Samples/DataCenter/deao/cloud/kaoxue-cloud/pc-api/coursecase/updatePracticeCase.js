/**
 * @description 修改一个情景案例
 * @author liangwei.xia
 * @since 2018-1-10
 */

 Parse.Cloud.define("updatePracticeCase", (request, response)=>{
        var coursecaseid = request.params.coursecaseid ; //获取课程案例id
     //   var practicecaseid = require.params.practicecaseid;//获取情景案例id
        var practicecaselist =request.params.practicecase; //获取修改后的情景案例对象
        var practicecase = JSON.parse(practicecaselist);
        console.log(practicecase);
        var coursecaeQuery = new Parse.Query("CourseCase");
        coursecaeQuery.get(coursecaseid,{useMasterKey:true}).then((coursecase)=>{
            var coursecasearr=coursecase.get("coursecase_practice");
                         coursecasearr.map((v,k)=>{
                                if(practicecase.id == v.id){
                                    coursecasearr.splice(k,1); //移除要修改的对象
                                    coursecasearr.push(practicecase); //将新的对象再补上
                                    coursecase.save().then(()=>{
                                                response.success({"code":"200"});
                                    }).catch((e)=>{
                                            response.error(e);
                                                
                                    })
                                };
                    })
        })
 });