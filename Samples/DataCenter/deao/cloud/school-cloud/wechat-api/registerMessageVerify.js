/**
 * 注册时，验证输入姓名同工号/学号是否一致
 */
Parse.Cloud.define('registermessageverify', function(request, response) {
    var responseData = '',student_length = 0 ,teacher_length = 0;
    const name = request.params.name;//填入的姓名
    const number = request.params.no;//填入的工号/学号

    const student_query = new Parse.Query('Student');
    student_query.equalTo('stu_name',name);
    student_query.equalTo('stu_number',number);

    const teacher_query = new Parse.Query('Teacher');
    teacher_query.equalTo('tcher_name',name);
    teacher_query.equalTo('tcher_number',number);

    student_query.find({useMasterKey:true}).then((students)=>{
        student_length = students.length;
        
        return teacher_query.find({useMasterKey:true});
    }).then((teachers)=>{
        teacher_length = teachers.length;

        if(student_length>0 || teacher_length>0){
            responseData = '{"code":"200","message":"输入正确"}';
        }else{
            responseData = '{"code":"500","message":"查询无结果"}';
        }
        
        response.success(JSON.parse(responseData));
    }).catch((e)=>{
        response.error(e);
    });


    
});