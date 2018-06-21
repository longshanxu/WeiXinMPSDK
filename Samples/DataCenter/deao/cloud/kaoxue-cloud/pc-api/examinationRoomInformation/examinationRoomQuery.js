/**
 * @description 查询考场的接口（条件查询）
 * @author mingcheng.feng
 * @since 2018-1-10
 */
Parse.Cloud.define("examinationroomquery", function(request, response) {
    const params = request.params;

    const roomSchoolId = params.school_id;//所属学校ID 
    const roomName = params.room_name;//考场名
    const roomStatus = params.status;//考长状态
    const roomManager_id = params.manager_id;//考场管理员


    const examinationRoom_query = new Parse.Query("ExaminationRoomInformation");
    examinationRoom_query.equalTo('examination_room_school_id',roomSchoolId);
    
    //如果传递有name参数，就把条件添加进去
    if(roomName !== undefined) examinationRoom_query.contains('examination_room_name',roomName);

    if(roomStatus !== undefined) examinationRoom_query.equalTo('examination_room_status',roomStatus);

    if(roomManager_id !== undefined) {
        //考场管理员教师pointer
        const Teacher = Parse.Object.extend("Teacher");
        const teacher = new Teacher ();
        teacher.id = roomManager_id;
        
        examinationRoom_query.equalTo('examination_room_manager',teacher);
    }

    examinationRoom_query.find((objs)=>{
        response.success(objs);
    }).catch((e)=>{
        response.error(e);
    });

    
});