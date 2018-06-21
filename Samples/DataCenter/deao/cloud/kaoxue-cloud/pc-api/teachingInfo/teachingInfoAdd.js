/**
 * @description 教学信息新增接口
 * @author mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define("teachinginfoadd", function(request, response) {
    const params = request.params;
    
    const title = params.title;
    const beginTime = params.begin_time;
    const endTime = params.end_time;
    const classes_id_array = params.classes;//relation
    const room_id_array = params.room;//relation
    const courseCase_id = params.course_case;//pointer
    const status = params.status;
    const remark = params.remark;
    const schoolId = params.school_id;

    const TeachingInfo = Parse.Object.extend('TeachingInfo');
    const teachingInfo = new TeachingInfo ();

    //教学信息的relation classRoom教室
    const classRoom_relation = teachingInfo.relation('teachingtask_room');
    const ClassRoom = Parse.Object.extend('ClassRoom');
    var classRoom_array = [];
    for(let i = 0; i < room_id_array.length; i++){
        const classRoom = new ClassRoom ();
        classRoom.id = room_id_array[i];
        classRoom_array.push(classRoom);
    }

    //教学信息的relation classes班级
    const classes_relation = teachingInfo.relation('teachingtask_classes');
    const Classes = Parse.Object.extend('Classes');
    var classes_array = [];
    for(let i = 0; i < classes_id_array.length; i++){
        const classes = new Classes ();
        classes.id = classes_id_array[i];
        classes_array.push(classes);
    }

    //教学信息的pointer courseCase 课程案例
    const CourseCase = Parse.Object.extend('CourseCase');
    const courseCase = new CourseCase ();
    courseCase.id = courseCase_id;

    classes_relation.add(classes_array);
    classRoom_relation.add(classRoom_array);
    teachingInfo.set('teachingtask_course_case',courseCase);
    teachingInfo.set('teachingtask_title',title);
    teachingInfo.set('teachingtask_begin_time',beginTime);
    teachingInfo.set('teachingtask_end_time',endTime);
    teachingInfo.set('teachingtask_school_id',schoolId);
    teachingInfo.set('teachingtask_status',status);
    teachingInfo.set('teachingtask_remark',remark);

    teachingInfo.save(null,{
        success:(obj)=>{
            response.success(obj);
        },
        error:(e)=>{
            response.error(e);
        }
    });
});