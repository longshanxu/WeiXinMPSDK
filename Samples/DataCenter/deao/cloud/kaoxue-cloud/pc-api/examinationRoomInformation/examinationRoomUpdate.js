/**
 * @description 考场信息更新接口
 * @author mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define('examinationroomupdate', function(request, response) {
    const params = request.params;

    const object_id = params.objectid;//考场的objectid
    const roomName = params.room_name;//考场名称
    const roomManager_id = params.manager_id;//考场管理员objectid
    const roomStatus = params.status;//考场状态
    const roomSchoolId = params.school_id;//考场所属学校ID
    const roomRemark = params.remark;//备注信息
    
    const examinationRoom_query = new Parse.Query('ExaminationRoomInformation');
    
    //考场管理员教师pointer
    const Teacher = Parse.Object.extend("Teacher");
    const teacher = new Teacher ();
    teacher.id = roomManager_id;

    examinationRoom_query.get(object_id).then((obj)=>{
        return obj.save({
            examination_room_name:roomName,
            examination_room_manager:teacher,
            examination_room_status:roomStatus,
            examination_room_school_id:roomSchoolId,
            examination_room_remark:roomRemark
        });
    }).then((new_obj)=>{
        response.success(new_obj);
    }).catch((e)=>{
        response.error(e);
    });
});