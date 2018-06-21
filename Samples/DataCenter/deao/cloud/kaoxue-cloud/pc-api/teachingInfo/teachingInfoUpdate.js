/**
 * @description 教学信息更新接口
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define("teachinginfoupdate", function(request, response) {
    const params = request.params;
    
    const object_id = params.objectid;//需要更新的教学信息的objectid
    const title = params.title;
    const beginTime = params.begin_time;
    const endTime = params.end_time;
    const classes_id_array = ['FLQFv53cdT'];//params.classes;//relation
    const room_id_array = ['l5DljWiMi5'];//params.room;//relation
    const courseCase_id = 'T7xI0ApurK';//params.course_case;//pointer
    const status = params.status;
    const remark = params.remark;
    const schoolId = params.school_id;

    const teachingInfo_query = new Parse.Query('TeachingInfo');

    //教学信息的relation classRoom教室
    
    const ClassRoom = Parse.Object.extend('ClassRoom');
    var classRoom_array = [];
    for(let i = 0; i < room_id_array.length; i++){
        const classRoom = new ClassRoom ();
        classRoom.id = room_id_array[i];
        classRoom_array.push(classRoom);
    }

    //教学信息的relation classes班级
    
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

    var teachingInfo;
    teachingInfo_query.get(object_id).then((obj)=>{
        //TODO remove old relations
        const classRoom_relation = obj.relation('teachingtask_room');
        const classes_relation = obj.relation('teachingtask_classes');
        teachingInfo = obj;

        // classes_relation.query().each((obj)=>{
        //     classes_relation.remove(obj);
        // });

        // classRoom_relation.query().each((obj)=>{
        //     console.log('removed');
        //     classRoom_relation.remove(obj);
        // });

        classes_relation.add(classes_array);
        classRoom_relation.add(classRoom_array);
        teachingInfo.set('teachingtask_course_case',courseCase);
        teachingInfo.set('teachingtask_title',title);
        teachingInfo.set('teachingtask_begin_time',beginTime);
        teachingInfo.set('teachingtask_end_time',endTime);
        teachingInfo.set('teachingtask_school_id',schoolId);
        teachingInfo.set('teachingtask_status',status);
        teachingInfo.set('teachingtask_remark',remark);
        
        return teachingInfo.save();
    }).then((new_obj)=>{
        response.success(new_obj);
    }).catch((e)=>{
        response.error(e);
    });
});