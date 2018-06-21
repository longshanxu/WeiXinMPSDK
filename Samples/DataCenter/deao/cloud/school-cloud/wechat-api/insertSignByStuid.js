//学生签到
Parse.Cloud.define("insertSignByStuid", function(request, response) {
  const query = new Parse.Query("StudentSigns");
  query.equalTo("movie", request.params.movie);
    query.find()
    .then((results) => {

      response.success("sum / results.length");
    })
    .catch(() =>  {
      response.error("movie lookup failed");
    });
});