/**
 * @description 考场设备管理更新对象接口
 * @author mingcheng.feng
 * @since 2018-1-12
 */
Parse.Cloud.define('equipmentupdate', function(request, response) {
    const params = request.params;

    const object_id = params.objectid;
    const equipmentStatus = params.status;
    const equipmentLocation = params.location;
    const equipmentType = params.type;
    const equipmentRoom = params.room;
    const equipmentIp = params.ip;//设备IP
    const equipmentPwd = params.pwd;//设备密码
    const equipmentSchool_id = params.school_id;
    const equipmentRemark = params.remark;

    const Equipment = Parse.Object.extend('Equipment');
    const equipment_query = new Parse.Query(Equipment);

    equipment_query.get(object_id).then((equipment)=>{
        return equipment.save({
            equipment_status:equipmentStatus,
            equipment_location:equipmentLocation,
            equipment_type:equipmentType,
            equipment_room:equipmentRoom,
            equipment_id:equipmentIp,
            equipment_pwd:equipmentPwd,
            equipment_remark:equipmentRemark,
            equipment_school_id:equipmentSchool_id           
        });
    }).then((new_obj)=>{
        response.success(new_obj);
    }).catch((e)=>{
        response.error(e);
    });

    
});