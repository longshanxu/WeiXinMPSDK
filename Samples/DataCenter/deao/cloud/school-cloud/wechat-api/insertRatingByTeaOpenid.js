//老师评价学生
Parse
  .Cloud
  .define("insertRatingByTeaOpenid", function (request, response) {
    const calendar_objectid = request.params.calendarobjectid; //上的课的objectid
    const student_objectid = request.params.studentobjectid; //被评价的学生的objectid
    const score = request.params.score; //打分

    //Calendar表
    const Calendar = Parse
      .Object
      .extend("Calendar");
    const calendarQuery = new Parse.Query(Calendar);

    const studentQuery = new Parse.Query("Student");

    //老师评价学生表
    const RatingStudent = Parse
      .Object
      .extend("TeacherRatingStudent");
    const ratingStudentQuery = new Parse.Query(RatingStudent);

    /*
      老师评价一次学生，就插入一条记录
   */
    var student, calendar;
    var cal_student = {};
    studentQuery
      .get(student_objectid, { useMasterKey: true })
      .then(() => {
        return studentQuery.get(student_objectid, { useMasterKey: true });
      })
      .then((stu) => {
        student = stu;

        return calendarQuery.get(calendar_objectid, { useMasterKey: true });
      }).then((cal) => {
        calendar = cal;
        //2.new一个RatingStudent对象
        var ratingStudent = new RatingStudent();
        ratingStudent.set("trc_value", score.toString()); //打分值
        ratingStudent.set("trc_student_id", student_objectid); //设置学生的Object值
        ratingStudent.set("trc_calendar_id", calendar.id); //设置课的id
        ratingStudent.set("trc_times", "1"); //评分次数
        ratingStudent.set("trc_student_number", student.get("stu_number"));
        ratingStudent.set("trc_student_name", student.get("stu_name"));
        ratingStudent.set("trc_school_id", student.get("stu_school_id"));

        return ratingStudent.save(null, { useMasterKey: true });
      }).then((rating) => {
        calendar
          .relation("cal_rating_student")
          .add(rating);
        var cal_students = calendar.get("cal_students");

        for (let i = 0, j = cal_students.length; i < j; i++) {
          const studentObjectid = cal_students[i].objectid;
          //如果被评价的学生在本节课应到学生中
          if (studentObjectid == student_objectid) {

            cal_students[i].score = (parseFloat(cal_students[i].score) + parseFloat(score)).toString();
            cal_students[i].times = (parseInt(cal_students[i].times) + 1).toString();
            cal_student = cal_students[i];
            break;
          }
        }

        return calendar.save({ "cal_students": cal_students }, { useMasterKey: true });
      }).then((object) => {
        response.success({ "status": "success", "content": "addNew success", "times": cal_student.times, "score": cal_student.score });
      }).catch((error) => {
        response.error(error);
      });

    // studentQuery
    //   .get(student_objectid, {useMasterKey: true})
    //   .then(() => {
    //     return studentQuery.get(student_objectid, {useMasterKey: true});
    //   })
    //   .then((stu) => {
    //     student = stu;

    //     //某一节课的对象
    //     calendarQuery
    //       .get(calendar_objectid, {useMasterKey: true})
    //       .then((object) => {
    //         //2.new一个RatingStudent对象
    //         var ratingStudent = new RatingStudent();
    //         ratingStudent.set("trc_value", score.toString()); //打分值
    //         ratingStudent.set("trc_student_id", student_objectid); //设置学生的Object值
    //         ratingStudent.set("trc_calendar_id", object.id); //设置课的id
    //         ratingStudent.set("trc_times", "1"); //评分次数
    //         ratingStudent.set("trc_student_number",stu.get("stu_number"));
    //         ratingStudent.set("trc_student_name",stu.get("stu_name"));
    //         ratingStudent.set("trc_school_id",stu.get("stu_school_id"));
    //         ratingStudent.save(null, {
    //           success: function (ratingStudent) {

    //             object
    //               .relation("cal_rating_student")
    //               .add(ratingStudent);
    //             var cal_students = object.get("cal_students");
    //             console.log("cal_students", cal_students);
    //             var cal_student = {};

    //             if (cal_students.length > 0) {
    //               for (let i = 0, j = cal_students.length; i < j; i++) {
    //                 const studentObjectid = cal_students[i].objectid;
    //                 //如果被评价的学生在本节课应到学生中
    //                 if (studentObjectid == student_objectid) {

    //                   cal_students[i].score = (parseFloat(cal_students[i].score) + parseFloat(score)).toString();
    //                   cal_students[i].times = (parseInt(cal_students[i].times) + 1).toString();
    //                   cal_student = cal_students[i];
    //                   break;
    //                 }

    //               }

    //               object.set("cal_students", cal_students);
    //               object.save(null, {
    //                 success: function (object) {
    //                   console.log("cal_student", cal_student);
    //                   response.success({"status": "success", "content": "addNew success", "times": cal_student.times, "score": cal_student.score});
    //                 },
    //                 error: function (object, error) {
    //                   response.error({"status": "error", "content": error});
    //                 },
    //                 useMasterKey: true
    //               });
    //             }


    //           },
    //           error: function (ratingStudent, error) {
    //             response.error(error);
    //           },
    //           useMasterKey: true
    //         });
    //       })
    //       .catch((error) => {
    //         response.error(error);
    //       });

    //   })
    //   .catch((error) => {
    //     response.error(error);
    //   });

  });