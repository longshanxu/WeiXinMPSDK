// 1. 查看有无注册
// 2. 用户没课，教室没课，显示无课
// 3. 用户没课，教室有课，显示教室课程列表
// 4. 用户有课，教室有课，显示当前课程

var moment = require('moment');
moment.locale("zh-cn");

// 时间处理
function timeFn(time) {
    var time = time.split("--");
    var start = time[0].split(":");
    var startSum = start[0] * 3600 + start[1] * 60 + start[2] * 1;
    var end = time[1].split(":");
    var endSum = end[0] * 3600 + end[1] * 60 + end[2] * 1;
    var now = moment(new Date()).format("HH:mm:ss");
    var nowTime = now.split(":");
    var nowSum = nowTime[0] * 3600 + nowTime[1] * 60 + nowTime[2] * 1;
    if (startSum - nowSum < 600 && endSum - nowSum > 0) {
        return true;
    } else {
        return false;
    }

    //test
}

Parse
    .Cloud
    .define("shake", (req, res) => {
        var Bindings = Parse.Object.extend("Bindings");
        var identity = new Parse.Query(Bindings);

        var Calendar = Parse.Object.extend("Calendar");
        var calendar = new Parse.Query(Calendar);

        var isRegister = true; // 假设已经注册
        var open_id = req.params.oid; //摇一摇进入的用户的openid
        var schoolId = req.params.sid; //用户的学校id
        var roomId = req.params.rid; //摇一摇设备摇到的教室id


        var today = new Date();
        var date = moment(today).format("YYYY-MM-DD");

        var bind_type = "";
        var bind_number = "";
        var bind_room = "";
        var stuObjectId;

            // 定位教室
            var classroom = new Parse.Query("ClassRoom");
            classroom.equalTo("objectId", roomId);
            classroom.equalTo("cr_school_id", schoolId);
            classroom
                .find({useMasterKey: true})
                .then((results) => {
    
                    console.log('classroom', results);
    
                    bind_room = results[0].id;
    
                    identity.equalTo("bind_open_id", open_id);
                    identity.equalTo("bind_school_id", schoolId);
                    identity
                        .find({useMasterKey: true})
                        .then((results) => {
                               console.log(results);
                            if (results.length == 0) {
                                console.log(111);
                                res.success({"code": 200, "event": 201, "course": []}); // 未注册
                            } else {
    
                                bind_type = results[0].get("bind_type");
                                bind_number = results[0].get("bind_number");
                                console.log('bind_type', bind_type);
                                console.log('bind_number', bind_number);
    
                                let eventcode = 100;
                                let tempArr = [];
                                
                                calendar.equalTo("cal_school_id", schoolId);
                                calendar.equalTo("cal_date", date);
                                calendar.equalTo("cal_room", bind_room);
                                calendar.include("cal_room_id");
                                if (bind_type == "老师") {
    
                                    calendar
                                        .find({useMasterKey: true})
                                        .then((data) => {
                                            console.log(data);
                                            let shouldCount = 0; //老师摇一摇进入后，看到的学生应到的人数
                                            let actualCount = 0; //实际签到的学生
                                            let temp = data;
                                            for (var index = 0; index < temp.length; index++) {
                                                var element = temp[index];
                                                // console.log(element.get("cal_teacher"));
                                                if (element.get("cal_teacher").length !== 0) {
                                                    element
                                                        .get("cal_teacher")
                                                        .map((v, k) => {
                                                            if (v.number == bind_number) {
                                                                tempArr.push(element);
                                                            }
                                                        })
                                                }
                                            }
     
                                            let len = tempArr.length;
    
                                            // 显示无课
                                            if(len == 0){
                                                eventcode = 202;
                                                res.success({
                                                    "course": tempArr,
                                                    "number": bind_number,
                                                    "shouldCount": 0,
                                                    "actualCount": 0,
                                                    "code": 200,
                                                    "event": eventcode,
                                                    "isType": 0
                                                })
                                            }else if (len > 0){
    
                                                tempArr.map((v, k) => {
                                                    if (timeFn(v.get("cal_section_time")) === true) {
                                                        tempArr.splice(0, len);
                                                        tempArr.push(v);
                                                        eventcode = 200;
                                                        return eventcode;
                                                    } else if (timeFn(v.get("cal_section_time")) === false) {
                                                        eventcode = 202
                                                        return eventcode;
                                                    }
                                                })
                                                
                                                tempArr.map((v, k) => {
                                                    //把element这节课的签到情况算出来
                                                    const should = v.get("cal_students") == undefined
                                                        ? []
                                                        : v.get("cal_students"); //本节课应到学生
                                                    shouldCount = should.length; //应到人数
    
                                                    //查询实际签到学生
                                                    console.log('shouldCount', shouldCount);
                                                    
                                                    v
                                                        .relation("cal_student_sign")
                                                        .query()
                                                        .count({
                                                            success: (count) => {
                                                                console.log('count', count);
                                                                actualCount = count;
                                                                res.success({
                                                                    "course": tempArr,
                                                                    "number": bind_number,
                                                                    "shouldCount": shouldCount,
                                                                    "actualCount": actualCount,
                                                                    "code": 200,
                                                                    "event": eventcode,
                                                                    "isType": 0
                                                                }); // 老师
                                                            },
                                                            error: (error) => {
                                                                res.error(error);
                                                            },
                                                            useMasterKey: true
                                                        });
                                                });
    
                                            }
                                            
    
                                        })
                                        .catch(() => {
                                            res.error("teacher lookup failed");
                                        });
                                } else if (bind_type == "学生") {
    
                                    calendar
                                        .find({useMasterKey: true})
                                        .then((data) => {
                                            console.log("stu",data);
                                            let temp = data;//该教室中一天的课程
                                            let sign = "false";
                                            for (var index = 0; index < temp.length; index++) {
                                                var element = temp[index];
    
                                                if (element.get("cal_students") !== undefined) {
                                                    element
                                                        .get("cal_students")
                                                        .map((v, k) => {
                                                            if (v.number == bind_number) {
                                                                tempArr.push(element);//摇一摇学生的在这个教室的课                                                           
                                                            }
                                                        })
                                                }
                                            }
    
                                            let len = tempArr.length;
    
                                            // 显示无课
                                            if(len == 0){
                                                eventcode = 202;
                                            }
    
                                            console.log('length',len);
                                            console.log(tempArr)
                                            tempArr.map((v, k) => {
                                                if (timeFn(v.get("cal_section_time")) === true) {
                                                    console.log("111")
                                                    console.log(v.get('cal_students'))
                                                    tempArr.splice(0, len);
                                                    tempArr.push(v);
                                                    v.get('cal_students').map((item,index)=>{
                                                        if (item.number == bind_number) {
                                                            sign = item.sign;
                                                            stuObjectId = item.objectid;
                                                            eventcode = 200;
                                                            return tempArr;
                                                        }
                                                    })
                                                } else if (timeFn(v.get("cal_section_time")) === false) {
                                                    eventcode = 202
                                                    return tempArr;
                                                }
                                            })
                                            console.log(stuObjectId);
                                            console.log(sign);
                                            res.success({
                                                "course": tempArr,
                                                "number": bind_number,
                                                "sign": sign,
                                                "code": 200,
                                                "event": eventcode,
                                                "isType": 1,
                                                "stuobjectid": stuObjectId
                                            }); // 学生
                                        })
                                        .catch(() => {
                                            res.error("student lookup failed");
                                        });
                                }
                            }
                        })
                        .catch((e) => {
                            response.error(e);
                        });
                })
                .catch((e) => {
                    res.error(e, "classroom is undefined");
                })


            // query.equalTo("date","") if(isRegister){     query.find({     }) }

    });