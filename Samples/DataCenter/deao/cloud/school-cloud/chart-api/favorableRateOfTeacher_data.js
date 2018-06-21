//教师好评率
const moment= require('moment');
moment.locale('zh-cn');
const percent = require("../reportform-api/GetPercent");
Parse.Cloud.define("favorableRateOfTeacher_data", function(request, response) {
    //根据院系获得本学期所有课程
    console.log("aaaa");
    var  cq  = new  Parse.Query("Calendar");
    var scq  = new Parse.Query("StudentRatingCourse");
    var teaArr = [];
    var srcArr= [];
    var schoolid =request.params.schoolid;
    cq.equalTo("cal_school_id",schoolid);
    cq.equalTo("cal_term","2017-2018（1）");
    cq.equalTo("cal_faculty","Euz01qT8Ii");
    cq.find({useMasterKey:true}).then((cal)=>{                  //查询一学期内一个院系的课程
            cal.map((v,k)=>{
                     var teaid =(v.get("cal_teacher"))[0].tcherid;
                     teaArr.push(teaid);                        //获得所有上课教师的id
            });
           teaArr=percent.removeArr(teaArr);                     //去重
    }).then(()=>{
            console.log(teaArr);
            scq.find({useMasterKey:true}).then((src)=>{         //获得所有评价课程信息
                        src.map((v,k)=>{
                                var rating={
                                        "teacherid":v.get("src_teacher_id"),
                                        "teachername":v.get("src_teacher_name"),
                                        "value":v.get("src_value"),                                  
                                };
                            srcArr.push(rating);                //并放入数组
                        });
                }).then(()=>{
                        var ratingArr =[];
                        teaArr.map((v,k)=>{
                            var ratings={};
                            var count=0;   
                            var j=0;
                                srcArr.map((n,i)=>{                         
                                           if(v==n.teacherid){
                                                    count+=Number(n.value);    
                                                    j++;                                                
                                                    ratings.teachername=n.teachername;          //获得教师名称
                                                    ratings.value=percent.Percent(count/j,5);        //以及好评率                                       
                                            }                                                                     
                                });
                                ratingArr.push(ratings);
                                
                        });
                        for(var i=0;i<ratingArr.length;i++){                            //去掉数组中的空元素
                                if(JSON.stringify(ratingArr[i])=="{}"){
                                       ratingArr.splice(i,1);
                                       i = i - 1; 
                                }   
                        };
                        response.success(ratingArr);
                }).catch((e)=>{
                        response.error(e);
                })
    })
    //得到学期内上课的老师
    //并在评价课程表中获得教师的评分，评价次数

});