/**
 * @description 班组信息更新接口
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('teamupdate', function(request, response) {
    const params = request.params;

    const object_id = params.objectid;
    const schoolId = params.school_id;
    const classesId = params.classes;//pointer
    const teamName = params.name;
    const teamStudent_ids = params.students;//relation,参数结果是一个数组
    const remark = params.remark;

    const Team = Parse.Object.extend('Team');
    const team_query = new Parse.Query(Team);
    const team = new Team ();

    const Classes = Parse.Object.extend('Classes');
    const classes = new Classes ();
    classes.id = classesId;

    //班组中的学生relation
    const teamStudent_relation = team.relation('team_students');
    const Student = Parse.Object.extend('Student');
    const student_array = [];
    for(let i = 0; i < teamStudent_ids.length; i++){
        const student = new Student ();
        student.id = teamStudent_ids[i];
        student_array.push(student);
    }

    team_query.get(object_id).then((team)=>{
        teamStudent_relation.add(student_array);
        team.set('team_remark',remark);
        team.set('team_classes',classes);
        team.set('team_school_id',schoolId);
        team.set('team_name',teamName);

        return team.save();
    }).then((new_obj)=>{
        response.success(new_obj);
    }).catch((e)=>{
        response.error(e);
    });


    
});