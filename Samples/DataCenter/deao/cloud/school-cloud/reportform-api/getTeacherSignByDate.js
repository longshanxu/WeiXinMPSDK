//获得当天教师上课的准点率



const fun =require("../reportform-api/GetPercent");

const moment= require('moment');
moment.locale('zh-cn');
Parse.Cloud.define("getTeacherSignByDate", function(request, response) {
  const query = new Parse.Query("Calendar");
  var date = moment(new Date()).format("YYYY-MM-DD");
  var teaArr=[];
  var teaArr1=[];
  var tcherArr=[];
  query.equalTo("cal_date", date);
  query.equalTo("cal_state","课后");
  query.find({ useMasterKey: true }).then((results) => {
        results.map((v,k)=>{
                var teasign={
                    "number":"",
                    "name":"",
                    "rate":""
                };
              tcherArr.push(v.get("cal_teacher")[0].number);
              teasign.number=v.get("cal_teacher")[0].number;
              teasign.name=v.get("cal_teacher")[0].name;
              //判断是否迟到，迟到则为0，否则为1
              var bool=moment(v.get("cal_begin_course"),"YYYY-MM-DD HH:mm:ss").isBefore(v.get("cal_open_course"),"YYYY-MM-DD HH:mm:ss");
              if(bool){
                  teasign.rate=0;//迟到
              }else{
                teasign.rate=1;
              };
              teaArr.push(teasign);           
        });
        for(var i=0;i<fun.removeArr(tcherArr).length;i++){
            var rate=0;
            var count=0;
            for(var j=0;j<teaArr.length;j++){
                  if(fun.removeArr(tcherArr)[i]==teaArr[j].number){
                          //取出相同教师的name跟number
                          var  teacher={
                            "name":teaArr[j].name,
                            "number":teaArr[j].number
                          };                         
                          rate+=teaArr[j].rate;//计算一个教师当天所上的课的迟到次数
                          count++;//计算一个教师的上课数
                  }
            };
            console.log(rate);
            var rating=fun.GetPercent(rate,count);//计算准点率
            teacher.rate=rating;
            teaArr1.push(teacher);
        };

        console.log(teaArr1);
        response.success(teaArr1);

    })
    .catch((e) =>  {
      response.error(e);
    });
});