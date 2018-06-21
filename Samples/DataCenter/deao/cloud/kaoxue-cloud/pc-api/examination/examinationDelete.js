/**
 * @description 考试信息的删除
 * @author mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define('examinationdelete', function(request, response) {
    const params = request.params;

    const object_id = params.objectid;//要删除的考试信息objectid

    const examination_query = new Parse.Query('ExaminationInfo');

    examination_query.get(object_id).then((obj)=>{
        // 根据objectid查询到对象 --->  删除对象
        return obj.destroy();
    }).then((obj)=>{
        response.success('delete successful');
    }).catch((e)=>{
        response.error(e);
    });
    
});