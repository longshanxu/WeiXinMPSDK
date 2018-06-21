/**
 * @description 更新考试信息
 * @author mingcheng.feng
 * @since 2018-1-9
 */
Parse.Cloud.define('examinationupdate', (request, response) => {
    const params = request.params;

    const object_id = params.objectid;
    const title = params.title;//考试标题
    const status = params.status;//考试的状态 开始/进行/结束
    const duration = params.duration;//考试持续时长
    const begin_time = params.begin_time;//考试开始时间
    const end_time = params.end_time;//考试结束时间
    const school_id = params.school_id;//学校的objectid
    const cruces = params.cruces;//考试要点
    const courseCase_id_array = params.courseCase;//['T7xI0ApurK','QzZteO58GM']; //考试关联的课程案例的id集合
    const classes_id_array = params.classes;//['otwvPzbt0A','36ft2tfCP2'];//考试关联的考试班级的id集合

    const examination_query = new Parse.Query('ExaminationInfo');

    //考试课程案例
    var Examination_CourseCase  = Parse.Object.extend('CourseCase');
    var examination_CourseCase_array = [];//一个考试关联一个或多个课程案例
    for(let i = 0; i < courseCase_id_array.length; i++){
        var examination_CourseCase = new Examination_CourseCase();
        examination_CourseCase.id = courseCase_id_array[i];
        examination_CourseCase_array.push(examination_CourseCase);
    }

    //考试班级
    var Examination_Classes = Parse.Object.extend('Classes');
    var examination_Classes_array = [];//一个考试关联一个或多个考试班级  
    for(let j = 0; j < classes_id_array.length; j++){
        var examination_Classes = new Examination_Classes();
        examination_Classes.id = classes_id_array[j];
        examination_Classes_array.push(examination_Classes);
    }

    examination_query.get(object_id).then((obj)=>{
        var examination_CourseCase_relation = obj.relation('examination_course_case');
        var examination_Classes_relation = obj.relation('examination_classes');

        obj.set('examination_status',status);
        obj.set('examination_duration',Number(duration));
        obj.set('examination_title',title);
        obj.set('examination_begin_time',begin_time);
        obj.set('examination_end_time',end_time);
        obj.set('examination_school_id',school_id);
        obj.set('examination_cruces',cruces);
        examination_CourseCase_relation.add(examination_CourseCase_array);
        examination_Classes_relation.add(examination_Classes_array);

        return obj.save();
    }).then((obj)=>{
        response.success('success');
    }).catch((e)=>{
        response.error(e);
    });
});