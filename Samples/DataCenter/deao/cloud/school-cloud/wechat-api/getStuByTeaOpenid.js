//老师获取学生信息
Parse.Cloud.define("getStuByTeaOpenid", function(request, response) {
  const query = new Parse.Query("Student");

  query.get(request.params.objectid,{ useMasterKey: true })
    .then((object) => {     
      response.success(object);
    })
    .catch((error) =>  {
      response.error(error);
    });
});