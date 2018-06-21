//获取学生签到信息(老师获取某一节课的签到情况)
Parse
  .Cloud
  .define("getStuSignsByTeaOpenid", function (request, response) {
    const calendarObjectId = request.params.objectid; //课的objectID

    const Calendar = Parse
      .Object
      .extend("Calendar");
    const calendarQuery = new Parse.Query(Calendar);

    calendarQuery
      .get(calendarObjectId, {useMasterKey: true})
      .then((object) => {

        let cal_signs = []; //存放某一节课已经签到的学生

        object
          .relation("cal_student_sign")
          .query()
          .each(function (relationObject) {
            cal_signs.push({
              "objectid": relationObject.get("ss_student_id"),
              "number": relationObject.get("ss_student_number"),
              "name": relationObject.get("ss_student_name"),
              "teacherObjectid": relationObject.get("ss_teacher_id"),
              "openid": relationObject.get("ss_student_openid")
            });
          }, {useMasterKey: true})
          .then(() => {
            response.success({"cal_signs": cal_signs});
          })
          .catch((error) => {
            response.error(error);
          });

      })
      .catch((error) => {
        response.error(error);
      });
  });