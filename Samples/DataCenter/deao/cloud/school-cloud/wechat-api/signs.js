//用户签到请求
var moment = require('moment');
moment.locale('zh-cn');
var openid_redis = require('../../../server/openid_redis')
Parse
    .Cloud
    .define('sign', (req, res) => {
        var sign_calendarId = req.params.objectid; //签到课的ID
        var sign_studentNumber = req.params.number; //签到学生的学号
        var teacherObjectid = req.params.teacherobjectid; //老师手动签到的标识
        var sign_studentobjectid = req.params.studentobjectid; //手动签到的学生的objectid
        var roomid = req.params.roomobjectid; //学生签到的教室roomobjectid
        var schoolId = req.params.schoolobjectid; //签到学生所在的学校objectid
        var sign_time = moment().local(true);

        var studentName = ""; //学生姓名
        var studentObjectId = ""; //学生的ObjectId
        var studentOpenid = ""; //学生的openid
        openid_redis.getOpenid(schoolId, sign_studentNumber, (data) => {
            studentOpenid = data;
        });

        //根据学生的学号，在Student表中查询该学生的基本信息
        var Student = Parse.Object.extend("Student");
        var studentQuery = new Parse.Query(Student);

        //1.根据课的ObjectID，查询课的签到情况
        var Calendar = Parse.Object.extend("Calendar");
        var calendarQuery = new Parse.Query(Calendar);

        var Signs = Parse.Object.extend("StudentSigns");

        //根据传过来的参数，去查询签到的学生的信息
        studentQuery
            .get(sign_studentobjectid, {useMasterKey: true})
            .then((student) => {
                studentName = student.get("stu_name");
                studentObjectId = student.id;
                
                //根据传过来的参数，查询签到的课程信息
                calendarQuery
                    .get(sign_calendarId, {useMasterKey: true})
                    .then((object) => {
                        // 生成一个签到对象Signs，往Calendar中签到的relation中添加。
                        // 注意，生成Signs对象时，Calendar要作为Signs表中的一个pointer插入
                        var sign = new Signs();

                        sign.set("ss_signs_time", sign_time.clone().toDate());
                        sign.set("ss_calendar_id", object.id);
                        sign.set("ss_student_number", sign_studentNumber);
                        sign.set("ss_student_name", studentName);
                        sign.set("ss_student_id", studentObjectId);
                        sign.set("ss_teacher_id", teacherObjectid);
                        sign.set("ss_student_openid", studentOpenid);
                        sign.set("ss_school_id", schoolId);
                        sign.set("ss_room_id", roomid);

                        sign.save(null, {
                            success: function (sign) {
                                //把本节课新增的签到信息，关联到calendar的relation中
                                object.relation("cal_student_sign").add(sign);
                                
                                //更新calendar中cal_students字段中的数据信息
                                var cal_students = object.get("cal_students");
                                if (cal_students != undefined && cal_students.length > 0) {
                                    for (let i = 0, j = cal_students.length; i < j; i++) {
                                        const oid = cal_students[i].objectid;
                                        //如果签到的学生在本节课应到学生中
                                        if (oid == studentObjectId) {
                                            cal_students[i].sign = "true";
                                            object.set("cal_students", cal_students);
                                            break;
                                        }
                                    }
                                }

                                //将更新后的calendar对象，重新保存
                                object.save(null, {
                                    success: function (object) {
                                        res.success({"status": "success"});
                                    },
                                    error: function (object, error) {
                                        res.error({"status": "fail", "message": error});
                                    },
                                    useMasterKey: true
                                });
                            },
                            error: function (sign, error) {
                                res.error({"status": "fail", "message": error});
                            },
                            useMasterKey: true
                        });
                        //签到Sign对象保存的一系列动作结束为止
                    }).catch((error) => {
                        res.error(error);
                    });

            }).catch((error) => {
                res.error(error);
            })

    });