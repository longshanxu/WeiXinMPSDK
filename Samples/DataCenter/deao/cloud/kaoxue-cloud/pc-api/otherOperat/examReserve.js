/**
 * @description 学生预约考试接口
 * @author mingcheng.feng
 * @since 2018-1-12
 */
Parse.Cloud.define('examreserve', function(request, response) {
    const params = request.params;

    const student_id = params.studentid;//预约考试学生的objectid
    const examination_id = params.examinationid;//预约的考试的objectid
    const room = params.room;//预约的考试教室名称
    const begin_time = params.begin;//预约的考试的开始时间
    const end_time = params.end;//预约的考试的结束时间

    const examination_query = new Parse.Query('ExaminationInfo');
    const student_query = new Parse.Query('Student');

    var student, examination;
    student_query.get(student_id).then((stu)=>{
        student = stu;
        
        return examination_query.get(examination_id);
    }).then((exam)=>{
        examination = exam;
        const student_name = student.get('stu_name');
        const student_number = student.get('stu_number');
        let student_info = {
            name:student_name,
            number:student_number,
            begintime:begin_time,
            endtime:end_time,
            room:room
        };
        let students_in_examination = examination.get('examination_students') === undefined ? [] : examination.get('examination_students');
        students_in_examination.push(student_info);
        return examination.save({
            examination_students:students_in_examination
        });
    }).then((new_exam)=>{
        response.success(new_exam);
    }).catch((e)=>{
        response.error(e);
    });


    
});