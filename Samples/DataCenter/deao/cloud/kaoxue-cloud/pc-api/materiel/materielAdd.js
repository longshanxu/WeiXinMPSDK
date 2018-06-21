/**
 * @description 物料管理新增接口
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('materieladd', function(request, response) {
    const params = request.params;

    const materielName = params.name;
    const materielCode = params.code;
    const materielNumber = params.number;//物料分类号
    const materielManager_id = params.manager_id;//物料负责人
    const materielLocation = params.location;
    const materielSchool_id = params.school_id;

    const Materiel = Parse.Object.extend('Materiel');
    const materiel = new Materiel ();

    materiel.save({
        materiel_number:materielNumber,
        materiel_name:materielName,
        materiel_code:materielCode,
        materiel_school_id:materielSchool_id,
        materiel_manager:materielManager_id,
        materiel_location:materielLocation
    },{
        success:(obj)=>{
            response.success(obj);
        },
        error:(e)=>{
            response.error(e);
        }
    });
    
});