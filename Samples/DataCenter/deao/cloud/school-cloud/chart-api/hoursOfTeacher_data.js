//教师学时
Parse
.Cloud
.define('hoursOfTeacher', (request, response) => {

      var datas = [
        {
          "week": "第一周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第二周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第三周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第四周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第五周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第六周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第七周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第八周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第九周",
          "plan": 7,
          "actual": 6.6
        }, {
          "week": "第十周",
          "plan": 7,
          "actual": 6.6
        }
      ];

      response.success(datas);

});