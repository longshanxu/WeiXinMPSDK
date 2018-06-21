/**
 * @description 考场信息删除接口
 * @author  mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define("examinationroomdelete", function(request, response) {
    const params = request.params;

    const object_id = params.objectid;

    const examinationRoom_query = new Parse.Query('ExaminationRoomInformation');

    examinationRoom_query.get(object_id).then((obj)=>{
        return obj.destory();
    }).then((delete_obj)=>{
        response.success('delete');
    }).catch((e)=>{
        response.error(e);
    });
    
});