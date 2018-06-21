/**
 * @description 查询考试信息（包含条件查询）
 * @author mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define('examinationquery', function(request, response) {
    const params = request.params;

    const school_id = params.school_id;
    const title = params.title;

    const examination_query = new Parse.Query('ExaminationInfo');

    examination_query.equalTo('examination_school_id',school_id);
    if(title !== undefined ) examination_query.contains('examination_title',title);

    examination_query.find((objs)=>{
        response.success(objs);
    }).catch((e)=>{
        response.error(e);
    });
    
});