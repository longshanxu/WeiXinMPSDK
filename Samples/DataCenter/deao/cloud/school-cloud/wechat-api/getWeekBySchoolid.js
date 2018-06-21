//获取当前周，总周
var moment = require('moment');
moment.locale("zh-cn");
function  getoffset(datetime){
    //获取偏移量
        var vNowDate=moment(new moment(datetime).format("YYYY-MM-DD"));//.add('month',0).add('days',-1);
        var vWeekOfDay=moment(vNowDate).format("E");//算出这周的周几
        var vWeekOfDays=7-vWeekOfDay-1;
        var vStartDate=moment(vNowDate).add('days',vWeekOfDays);
        var vEndDate=moment(vNowDate).add('days',-vWeekOfDay);
        var offset=moment(vStartDate).format("W"); 
        return offset;
};
Parse
  .Cloud
  .define("getWeekBySchoolid", function (request, response) {       
        var openid = request.params.oid;
        var bq = new Parse.Query("Bindings");
        var tq =new Parse.Query("Term");
        var termArr=[];
        var schoolid="";
        bq.equalTo("bind_open_id",openid);
        bq.find({useMasterKey:true}).then((binding)=>{
                schoolid=binding[0].get("bind_school_id");
        }).then(()=>{
              tq.equalTo("term_school_id",schoolid);
              tq.find({useMasterKey:true}).then((term)=>{                  
                      term.map((v,k)=>{
                            var term = {
                                  "starttime":v.get("term_starttime"),
                                  "endtime":v.get("term_endtime"),
                                  "totalweek":v.get("term_totalweek"),
                                  "name":v.get("term_name")
                            };

                              termArr.push(term);
                      })
              }).then(()=>{
                  var date = new Date();
                  var term1={
                      "currentweek":"",
                      "totalweek":"",
                      "name":"",
                      "offset":""
                  };
                  for(var i=0;i<termArr.length;i++){
                          if(date>=termArr[i].starttime && date<=termArr[i].endtime){
                                //获取偏移量                               
                                var offset=getoffset(termArr[i].starttime)-1;
                                //获取当前周                               
                                var nowoffset=getoffset(date);
                                term1.offset=offset;
                                term1.currentweek=nowoffset-offset;                               
                                term1.totalweek=termArr[i].totalweek;
                                term1.name=termArr[i].name;
                          }
                  };
                  response.success(term1);
              })
        }).catch((e)=>{
                  response.error(e);
        })
       });