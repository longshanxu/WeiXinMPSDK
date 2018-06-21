/**
 * @description 班组的查询接口（包含条件查询）
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('teamquery', function(request, response) {
    const params = request.params;

    const schoolId = params.school_id;
    const classesId = params.classes_id;//班级的objectid
    const teamName = params.name;
    const teamStudent_id = params.student_id;//某一个学生的objectId

    const team_query = new Parse.Query("Team");
    team_query.equalTo('team_school_id',schoolId);

    if(teamName !== undefined) team_query.contains('team_name');

    if(classesId !== undefined){
        const Classes = Parse.Object.extend('Classes');
        const classes = new Classes ();
        classes.id = classesId;
        team_query.equalTo('team_classes',classes);
    }

    if(teamStudent_id !== undefined){
        const Student = Parse.Object.extend('Student');
        const student = new Student ();
        student.id = teamStudent_id;
        team_query.equalTo('team_students',student);
    }

    team_query.find().then((teams)=>{
        response.success(teams);
    }).catch((e)=>{
        response.error(e);
    });


    
});