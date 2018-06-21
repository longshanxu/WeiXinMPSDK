//学生地区分布数据分析
Parse
.Cloud
.define('arealDistributionData', (request, response) => {


      const url_pie1 = [
        {
          "category": "河南省",
          "value": 37
        }, {
          "category": "北京",
          "value": 24
        }, {
          "category": "江苏",
          "value": 11
        }, {
          "category": "浙江",
          "value": 9
        }, {
          "category": "上海",
          "value": 7
        }, {
          "category": "其他",
          "value": 12
        }
      ];

      response.success(url_pie1);

});