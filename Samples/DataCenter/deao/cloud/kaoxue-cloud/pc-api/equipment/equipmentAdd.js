/**
 * @description 考场设备管理新增对象接口
 * @author mingcheng.feng
 * @since 2018-1-12
 */
Parse.Cloud.define('equipmentadd', function(request, response) {
    const params = request.params;

    const equipmentStatus = params.status;
    const equipmentLocation = params.location;
    const equipmentType = params.type;
    const equipmentRoom = params.room;
    const equipmentIp = params.ip;//设备IP
    const equipmentPwd = params.pwd;//设备密码
    const equipmentSchool_id = params.school_id;
    const equipmentRemark = params.remark;

    const Equipment = Parse.Object.extend('Equipment');
    const equipment = new Equipment ();

    equipment.save({
        equipment_status:equipmentStatus,
        equipment_location:equipmentLocation,
        equipment_type:equipmentType,
        equipment_room:equipmentRoom,
        equipment_id:equipmentIp,
        equipment_pwd:equipmentPwd,
        equipment_remark:equipmentRemark,
        equipment_school_id:equipmentSchool_id
    },{
        success:(obj)=>{
            response.success(obj);
        },
        error:(e)=>{
            response.error(e);
        }
    });

    
});