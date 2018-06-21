/**
 * @description 增加课程案例
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("addCourseCase",(request,response)=>{
            var courseid = request.params.courseid; //获取所属课程id
            var coursename=request.params.name;//获取课程案例名称
            var courseremark = request.params.remark; //获取课程备注
            var CourseCase = Parse.Object.extend("CourseCase");
            var coursecase = new CourseCase();
            if(courseremark == ''){
                coursecase.set("coursecase_remark",[]);
            };
            coursecase.set("coursecase_course",courseid);
            coursecase.set("coursecase_name",coursename);
            coursecase.set("coursecase_remark",courseremark);
            coursecase.set("coursecase_practice",[]);
            coursecase.set("coursecase_theory",[]);
            coursecase.set("coursecase_school_id","ydhojXDX4I");
            coursecase.save().then(()=>{
                        response.success({"code":"200"});                            
            }).catch((e)=>{
                    response.error(e);
            });


 })