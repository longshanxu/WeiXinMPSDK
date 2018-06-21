/**
 * @description 物料信息更新接口
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('materielupdate', function(request, response) {
    const params = request.params;

    const objectId = params.objectid;
    const materielName = params.name;
    const materielCode = params.code;
    const materielNumber = params.number;//物料分类号
    const materielManager_id = params.manager_id;//物料负责人
    const materielLocation = params.location;
    const materielSchool_id = params.school_id;

    const Materiel = Parse.Object.extend('Materiel');
    const materiel_query = new Parse.Query (Materiel);

    materiel_query.get(objectId).then((materiel)=>{
        return materiel.save({
            materiel_number:materielNumber,
            materiel_name:materielName,
            materiel_code:materielCode,
            materiel_school_id:materielSchool_id,
            materiel_manager:materielManager_id,
            materiel_location:materielLocation
        });
    }).then((new_materiel)=>{
        response.success(new_materiel);
    }).catch((e)=>{
        response.error(e);
    });
    
});