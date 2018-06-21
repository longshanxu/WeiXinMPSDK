/**
 * @description 查看考试预约学生的接口
 * @author mingcheng.feng
 * @since 2018-1-12
 */
Parse.Cloud.define('reservationinfo', function(request, response) {
    const params = request.params;

    const examination_id = params.examinationid;

    const examination_query = new Parse.Query('ExaminationInfo');

    examination_query.get(examination_id).then((exam)=>{
        const students = exam.get('examination_students') === undefined ? [] : exam.get('examination_students');

        response.success(students);
    }).catch((e)=>{
        response.error(e);
    });
    
});