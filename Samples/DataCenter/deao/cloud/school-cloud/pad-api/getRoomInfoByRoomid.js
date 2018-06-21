//获取教室信息
Parse
  .Cloud
  .define("getRoomInfoByRoomid", function (request, response) {

    const roomObjectId = request.params.roomid;//教室ID

    const classroom_query = new Parse.Query("ClassRoom");//教室
    
    const building_query = new Parse.Query("TeachingBuilding");//教学楼

    const campus_query = new Parse.Query("Campus");//校区

    const school_query = new Parse.Query("School");//学校


    var value = {
      "classRoom":null,//教室
      "teachingBuilding":null,//教学楼
      "campus":null,//校区
      "school":null//学校
    };
    classroom_query
      .get(roomObjectId,{useMasterKey:true})
      .then((classroom) => {
        //查教室
        value.classRoom = classroom;
        return classroom_query.get(roomObjectId,{useMasterKey:true});
      }).then((classroom)=>{
        
        //查教学楼
        const teachingbuilding_id = classroom.get("cr_teachingbuilding_id");
        return building_query.get(teachingbuilding_id,{useMasterKey:true});
      }).then((building)=>{
        value.teachingBuilding = building;

        //查校区
        const campus_id = building.get("tb_campus_id");
        return campus_query.get(campus_id,{useMasterKey:true});
      }).then((campus)=>{
        value.campus = campus;

        //查学校
        const school_id = campus.get("cam_school");
        return school_query.get(school_id,{useMasterKey:true});
      }).then((school)=>{
        value.school = school;

        response.success(value);
      })
      .catch((error) => {
        response.error(error);
      });
  });