/**
 * @description 班组的删除接口
 * @author mingcheng.feng
 * @since 2018-1-11
 */
Parse.Cloud.define('teamdelete', function(request, response) {
    const params = request.params;

    const object_id = params.objectid;

    const Team = Parse.Object.extend('Team');
    const team_query = new Parse.Query(Team);

    team_query.get(object_id).then((team)=>{
        return team.destory();
    }).then((delete_obj)=>{
        response.success(delete_obj);
    }).catch((e)=>{
        response.error(e);
    });


    
});