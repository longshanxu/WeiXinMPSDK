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
}

Parse
    .Cloud
    .define("shake_r", (req, res) => {
        var Bindings = Parse.Object.extend("Bindings");
        var identity = new Parse.Query(Bindings);

        var Calendar = Parse.Object.extend("Calendar");
        

        var isRegister = true; // 假设已经注册
        var open_id = req.params.oid; //摇一摇进入的用户的openid
        var schoolId = req.params.sid; //用户的学校id
        var roomId = req.params.rid; //摇一摇设备摇到的教室id

        var nickName = req.params.nickname;//8-19会议需要的昵称
        var sex = req.params.sex;
        var headImg = req.params.headimgurl;

        var today = new Date();
        var date = moment(today).format("YYYY-MM-DD");

        var bind_type = "";
        var bind_number = "";
        var bind_room = "";
        var stuObjectId;

        //判断如果不是秦啸龙的openid，就当做是会场其他人员摇一摇
        if(open_id!=="o8PVKw-kZt_21nSw-6i9kxTjKFY0"){
            console.log("o8PVKw-kZt_21nSw-6i9kxTjKFY0");
            //会场专用处理代码
            //首先检索绑定表中有没有存在数据
            identity.equalTo("bind_school_id",schoolId);
            identity.equalTo("bind_open_id", open_id);

            identity.find({
                useMasterKey:true,
                success:(binds)=>{
                    if(binds.length>0){
                        console.log('bindings表中有');
                        bind_number = open_id;
                        var calender3 = new Parse.Query(Calendar);
                        calender3.equalTo("cal_school_id", schoolId);
                        calender3.equalTo("cal_date", date);
                        calender3.equalTo("cal_room", roomId);
                        calender3.include("cal_room_id");
                        calender3.find({
                            useMasterKey: true,
                            success:(cals)=>{
                                let eventcode = 100;
                                let tempArr = [];
                                let temp = data;//该教室中一天的课程
                                console.log('data',data[0].get("cal_students"));
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
                            },
                            error:(e)=>{
                                res.error(e);
                            }
                        });                       
                    }else{
                        //摇一摇进入的，没有绑定过
                        var new_bind = new Bindings ();
                        new_bind.set("bind_school_id",schoolId);
                        new_bind.set("bind_open_id",open_id);
                        new_bind.set("bind_number",open_id);
                        bind_number = open_id;
                        new_bind.set("bind_type","学生");
                        new_bind.set("bind_state","使用");
    
                        new_bind.save({useMasterKey:true}).then(()=>{
                            return new_bind.save({useMasterKey:true});
                        }).then((new_bind)=>{
                            console.log("new_bind:",new_bind);
                            var Student = Parse.Object.extend("Student");
                            var student_query = new Parse.Query(Student);
                            var student = new Student ();
                            student.set("stu_gender",sex);
                            student.set("stu_number",open_id);
                            student.set("stu_name",nickName);
                            student.set("stu_school_id",schoolId);
                            student.set("stu_classes","RGay8WWICy");
                            return student.save({useMasterKey:true});
                        }).then((stu)=>{
                            var calender1 = new Parse.Query(Calendar);
                            
                            calender1.equalTo("cal_school_id", schoolId);
                            calender1.equalTo("cal_date", date);
                            calender1.equalTo("cal_room", roomId);
                            calender1.include("cal_room_id");
                            calender1.find({
                                useMasterKey:true,
                                success:(calenders)=>{
                                    //本教室所有的课程
                                    let array = [];//当前时间可以上课的calendar数组
                                    let eventcode = 100;
                                    let sign = "false";
                                    calenders.map((v,k)=>{
                                        if (timeFn(v.get("cal_section_time")) === true){
                                            array.push(v);
                                            eventcode = 200;
                                        }
                                    });
                                    
                                    //说明有课可以去签到
                                    if(array.length>0){
                                        res.success({
                                            "course": array,
                                            "number": bind_number,
                                            "sign": sign,
                                            "code": 200,
                                            "event": eventcode,
                                            "isType": 1,
                                            "stuobjectid": stu.id
                                        }); // 学生                                         
                                    }else{
                                        //没有课可以签到
                                        eventcode = 202;
                                        res.success({
                                            "course": calenders,
                                            "number": bind_number,
                                            "sign": sign,
                                            "code": 200,
                                            "event": eventcode,
                                            "isType": 1,
                                            "stuobjectid": stu.id
                                        }); // 学生                                        
                                    }


                                },
                                error:(e)=>{
                                    res.error(e);
                                }
                            })                            
                        })                      
                    }
                },
                error:(e)=>{
                    res.error(e);
                }
            })













            // identity.find({useMasterKey:true}).then((binds)=>{
                
            //     if(binds.length>0){
            //         console.log('bindings表中有');
            //         bind_number = open_id;
            //         var calender3 = new Parse.Query(Calendar);
            //         calender3.equalTo("cal_school_id", schoolId);
            //         calender3.equalTo("cal_date", date);
            //         calender3.equalTo("cal_room", roomId);
            //         calender3.include("cal_room_id");
            //         calender3.find({useMasterKey: true}).then((data) => {
                        
            //             let eventcode = 100;
            //             let tempArr = [];
            //             let temp = data;//该教室中一天的课程
            //             console.log('data',data[0].get("cal_students"));
            //             let sign = "false";
            //             for (var index = 0; index < temp.length; index++) {
            //                 var element = temp[index];

            //                 if (element.get("cal_students") !== undefined) {
            //                     element
            //                         .get("cal_students")
            //                         .map((v, k) => {
            //                             if (v.number == bind_number) {
            //                                 tempArr.push(element);//摇一摇学生的在这个教室的课                                                           
            //                             }
            //                         })
            //                 }
            //             }

            //             let len = tempArr.length;

            //             // 显示无课
            //             if(len == 0){
            //                 eventcode = 202;
            //             }

            //             tempArr.map((v, k) => {
            //                 if (timeFn(v.get("cal_section_time")) === true) {
            //                     console.log("111")
            //                     console.log(v.get('cal_students'))
            //                     tempArr.splice(0, len);
            //                     tempArr.push(v);
            //                     v.get('cal_students').map((item,index)=>{
            //                         if (item.number == bind_number) {
            //                             sign = item.sign;
            //                             stuObjectId = item.objectid;
            //                             eventcode = 200;
            //                             return tempArr;
            //                         }
            //                     })
            //                 } else if (timeFn(v.get("cal_section_time")) === false) {
            //                     eventcode = 202
            //                     return tempArr;
            //                 }
            //             })
            //             console.log(stuObjectId);
            //             console.log(sign);
            //             res.success({
            //                 "course": tempArr,
            //                 "number": bind_number,
            //                 "sign": sign,
            //                 "code": 200,
            //                 "event": eventcode,
            //                 "isType": 1,
            //                 "stuobjectid": stuObjectId
            //             }); // 学生                                       
            //         });
            //     }else{
            //         console.log('bindings表中没有');
            //         //1. 向Bindings表中插入数据
            //         var new_bind = new Bindings ();
            //         new_bind.set("bind_school_id",schoolId);
            //         new_bind.set("bind_open_id",open_id);
            //         new_bind.set("bind_number",open_id);
            //         bind_number = open_id;
            //         new_bind.set("bind_type","学生");
            //         new_bind.set("bind_state","使用");

            //         new_bind.save({useMasterKey:true}).then(()=>{
            //             return new_bind.save({useMasterKey:true});
            //         }).then((new_bind)=>{
            //             console.log("new_bind:",new_bind);
            //             var Student = Parse.Object.extend("Student");
            //             var student_query = new Parse.Query(Student);
            //             var student = new Student ();
            //             student.set("stu_gender",sex);
            //             student.set("stu_number",open_id);
            //             student.set("stu_name",nickName);
            //             student.set("stu_school_id",schoolId);
            //             student.set("stu_classes","RGay8WWICy");
            //             return student.save({useMasterKey:true});
            //         }).then((student)=>{
            //             console.log(student);
            //             var calender1 = new Parse.Query(Calendar);
                        
            //             calender1.equalTo("cal_school_id", schoolId);
            //             calender1.equalTo("cal_date", date);
            //             calender1.equalTo("cal_room", roomId);
            //             calender1.include("cal_room_id");
            //             calender1.find({useMasterKey:true}).then((results)=>{
            //                 console.log(results.length);
            //                 results.forEach(function(v,k) {
            //                     var e = {
            //                         "number":student.get("stu_number"),
            //                         "objectid":student.id,
            //                         "name":student.get("stu_name"),
            //                         "score":"0",
            //                         "times":"0",
            //                         "sign":"false",
            //                         "img":headImg,
            //                         "gender":student.get("stu_gender")
            //                     };
            //                     var s = v.get("cal_students");
            //                     s.push(e);
            //                     v.set("cal_students",s);
            //                     v.save({useMasterKey:true});
            //                 });
            //             });
                        
            //             return calender1.find({useMasterKey:true});
            //         }).then(()=>{
            //             var calender2 = new Parse.Query(Calendar);
            //             calender2.equalTo("cal_school_id", schoolId);
            //             calender2.equalTo("cal_date", date);
            //             calender2.equalTo("cal_room", roomId);
            //             calender2.include("cal_room_id");
            //             return calender2.find({useMasterKey:true});             
            //         }).then((calendars)=>{
            //             console.log("calendars",calendars)
            //             let eventcode = 100;
            //             let tempArr = [];
            //             let temp = calendars;//该教室中一天的课程
            //             let sign = "false";
            //             for (var index = 0; index < temp.length; index++) {
            //                 var element = temp[index];

            //                 if (element.get("cal_students") !== undefined) {
            //                     element
            //                         .get("cal_students")
            //                         .map((v, k) => {
            //                             if (v.number == bind_number) {
            //                                 tempArr.push(element);//摇一摇学生的在这个教室的课                                                           
            //                             }
            //                         })
            //                 }
            //             }

            //             let len = tempArr.length;

            //             // 显示无课
            //             if(len == 0){
            //                 eventcode = 202;
            //             }

            //             tempArr.map((v, k) => {
            //                 if (timeFn(v.get("cal_section_time")) === true) {
            //                     console.log("111")
            //                     console.log(v.get('cal_students'))
            //                     tempArr.splice(0, len);
            //                     tempArr.push(v);
            //                     v.get('cal_students').map((item,index)=>{
            //                         if (item.number == bind_number) {
            //                             sign = item.sign;
            //                             stuObjectId = item.objectid;
            //                             eventcode = 200;
            //                             return tempArr;
            //                         }
            //                     })
            //                 } else if (timeFn(v.get("cal_section_time")) === false) {
            //                     eventcode = 202
            //                     return tempArr;
            //                 }
            //             })
            //             console.log(stuObjectId);
            //             console.log(sign);
            //             res.success({
            //                 "course": tempArr,
            //                 "number": bind_number,
            //                 "sign": sign,
            //                 "code": 200,
            //                 "event": eventcode,
            //                 "isType": 1,
            //                 "stuobjectid": stuObjectId
            //             }); // 学生  
            //         }).catch((error)=>{
            //             res.error(error);
            //         });
            //     }
            // }).catch((error)=>{
            //     res.error(error);
            // });


        }else{

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
                                
                                calender.equalTo("cal_school_id", schoolId);
                                calender.equalTo("cal_date", date);
                                calender.equalTo("cal_room", bind_room);
                                calender.include("cal_room_id");
                                if (bind_type == "老师") {
    
                                    calender
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
    
                                    calender
                                        .find({useMasterKey: true})
                                        .then((data) => {
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
        }


            // query.equalTo("date","") if(isRegister){     query.find({     }) }

    });