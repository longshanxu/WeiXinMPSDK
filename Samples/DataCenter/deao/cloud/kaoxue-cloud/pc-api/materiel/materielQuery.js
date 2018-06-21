/**
 * @description 物料信息查询接口
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('materielquery', function(request, response) {
    const params = request.params;

    const materielName = params.name;
    const materielCode = params.code;
    const materielNumber = params.number;//物料分类号
    const materielManager_id = params.manager_id;//物料负责人
    const materielLocation = params.location;
    const materielSchool_id = params.school_id;

    const Materiel = Parse.Object.extend('Materiel');
    const materiel_query = new Parse.Query (Materiel);

    materiel_query.equalTo('materiel_school_id',materielSchool_id);

    if(materielName !== undefined) materiel_query.contains('materiel_name',materielName);

    if(materielCode !== undefined) materiel_query.equalTo('materiel_code',materielCode);

    if(materielNumber !== undefined) materiel_query.equalTo('materiel_number',materielNumber);

    if(materielManager_id !== undefined) materiel_query.equalTo('materiel_manager',materielManager_id);

    if(materielLocation !== undefined) materiel_query.contains('materiel_location',materielLocation);

    materiel_query.find().then((objs)=>{
        response.success(objs);
    }).catch((e)=>{
        response.error(e);
    });
    
});