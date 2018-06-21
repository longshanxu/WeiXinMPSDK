//获取课程的签到信息，使用websocket
Parse.Cloud.define("getSignInfoByRoomid", function(request, response) {
  const query = new Parse.Query("Classroom");
  query.equalTo("movie", request.params.movie);
    query.find()
    .then((results) => {
      let sum = 0;
      for (let i = 0; i < results.length; ++i) {
        sum += results[i].get("stars");
      }
      response.success(sum / results.length);
    })
    .catch(() =>  {
      response.error("movie lookup failed");
    });
});