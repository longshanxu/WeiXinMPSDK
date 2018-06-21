/**
 * @description 获得某个院系下的所有课程
 * @author liangwei.xia
 * @since 2018-1-10
 */
Parse.Cloud.define("getCourseByFaculty",(request,response)=>{
    console.log("abc");
    var facultyid = request.params.facultyid;  //获取院系id
    var coursearr=[];
    var courseQuery = new Parse.Query("course");
    courseQuery.equalTo("course_faculty_id",facultyid);
    courseQuery.find({useMasterKey:true}).then((course)=>{
        course.map((v,k)=>{
                var course ={};
                course.id=v.id;
                course.name=v.get("cou_name");
                coursearr.push(course);
        })
        response.success(coursearr);//获得课程
    }).catch((e)=>{
            response.error(e);
    })
 })