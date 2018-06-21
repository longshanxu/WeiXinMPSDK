/**
 * @description 获得某个课程下的所有课程案例
 * @author liangwei.xia
 * @since 2018-1-11
 */
var moment = require("moment");
moment.locale("zh-cn");
Parse.Cloud.define("getCourseCaseByCourse",(request,response)=>{
    var courseid = request.params.courseid;
    var coursecasearr =[];
    var coursecaeQuery = new Parse.Query("CourseCase");
    coursecaeQuery.equalTo("coursecase_course",courseid);
    coursecaeQuery.find({useMasterKey:true}).then((coursecase)=>{
        coursecase.map((v,k)=>{
                var coursecaseobj ={};
                coursecaseobj.id=v.id;
                coursecaseobj.name=v.get("coursecase_name");
                coursecaseobj.createtime=moment(v.createAt).format('YYYY-MM-DD HH:mm:ss');
                coursecasearr.push(coursecaseobj);
        })
        response.success(coursecasearr);//获得所有课程案例
    }).catch((e)=>{
            response.error(e);
    })
})