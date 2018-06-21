/**
 * @description 考场信息新增接口
 * @author mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define('examinationroomadd', function(request, response) {
    const params = request.params;

    const roomName = params.room_name;//考场名称
    const roomManager_id = params.manager_id;//考场管理员objectid
    const roomStatus = params.status;//考场状态
    const roomSchoolId = params.school_id;//考场所属学校ID
    const roomRemark = params.remark;//备注信息
    
    const ExaminationRoom = Parse.Object.extend("ExaminationRoomInformation");
    const examinationRoom = new ExaminationRoom ();
    
    //考场管理员教师pointer
    const Teacher = Parse.Object.extend("Teacher");
    const teacher = new Teacher ();
    teacher.id = roomManager_id;

    examinationRoom.save({
        examination_room_name:roomName,
        examination_room_manager:teacher,
        examination_room_status:roomStatus,
        examination_room_school_id:roomSchoolId,
        examination_room_remark:roomRemark
    },{
        success:(obj)=>{
            response.success(obj);
        },
        error:(e)=>{
            response.error(e);
        }
    });
    
});