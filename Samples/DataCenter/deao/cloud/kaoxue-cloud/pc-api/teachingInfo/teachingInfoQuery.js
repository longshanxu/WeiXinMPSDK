/**
 * @description 教学信息查询接口（条件查询）
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('teachinginfoquery', function(request, response) {
    const params = request.params;

    const schoolId = params.school_id;
    const title = params.title;
    const status = params.status;

    const teachingInfo_query = new Parse.Query('TeachingInfo');
    teachingInfo_query.equalTo('teachingtask_school_id',schoolId);

    //如果传入的参数有值，切不等于undefined
    if(title !== undefined) teachingInfo_query.contains('teachingtask_title',title);

    if(status !== undefined) teachingInfo_query.equalTo('teachingtask_status',status);

    teachingInfo_query.find((objs)=>{
        response.success(objs);
    }).catch((e)=>{
        response.error(e);
    });

    
});