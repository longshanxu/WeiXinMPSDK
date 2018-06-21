//课程完成率
Parse
.Cloud
.define('calendarCompleteRate', (request, response) => {


      var datas = [
        {
          "name": "余波",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }, {
          "name": "李晨雷",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }, {
          "name": "杜存",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }, {
          "name": "张珍",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }, {
          "name": "李小沛",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }, {
          "name": "孙蓉",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }, {
          "name": "李苏",
          "course_has": 40,
          "course_done": 18,
          "course_completeRate": 45
        }

      ];

      response.success(datas);

});