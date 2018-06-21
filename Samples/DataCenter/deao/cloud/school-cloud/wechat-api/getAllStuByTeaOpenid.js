//获取某一节课所有的应该上课学生
Parse
  .Cloud
  .define("getAllStuByTeaOpenid", function (request, response) {
    const calendarObjectId = request.params.objectid; //课的objectID

    const Calendar = Parse.Object.extend("Calendar");
    const calendarQuery = new Parse.Query(Calendar);

    calendarQuery
      .get(calendarObjectId,{useMasterKey:true})
      .then((object) => {

        response.success({"cal_students": object.get("cal_students")});
      })
      .catch((error) => {
        response.error(error);
      });
  });