//获取一周的课程信息
Parse.Cloud.define("getScheduleByWeek", function(request, response) {
  const query = new Parse.Query("Calendar");
  console.log(request.params.semester);
  console.log(request.params.schoolid);
  query.equalTo("cal_semester", request.params.semester);
  query.equalTo("cal_school_id", request.params.schoolid);
  query.find({ useMasterKey: true }).then((results) => {
      response.success(results);
    })
    .catch((e) =>  {
      response.error(e);
    });
});