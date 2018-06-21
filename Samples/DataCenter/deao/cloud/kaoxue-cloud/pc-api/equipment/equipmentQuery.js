/**
 * @description 考场设备管理查询对象接口（包含条件查询）
 * @author mingcheng.feng
 * @since 2018-1-12
 */
Parse.Cloud.define('equipmentquery', function(request, response) {
    const params = request.params;

    const equipmentSchool_id = params.school_id;
    const equipmentStatus = params.status;
    const equipmentLocation = params.location;
    const equipmentType = params.type;
    const equipmentIp = params.ip;//设备IP

    const Equipment = Parse.Object.extend('Equipment');
    const equipment_query = new Parse.Query(Equipment);
    equipment_query.equalTo('equipment_school_id',equipmentSchool_id);

    if(equipmentStatus !== undefined) equipment_query.equalTo('equipment_status',equipmentStatus);

    if(equipmentLocation !== undefined) equipment_query.contains('equipment_location',equipmentLocation);

    if(equipmentType !== undefined) equipment_query.equalTo('equipment_type',equipmentType);

    if(equipmentIp !== undefined) equipment_query.equalTo('equipment_id',equipmentIp);

    equipment_query.find().then((objs)=>{
        response.success(objs);
    }).catch((e)=>{
        response.error(e);
    });
    
});