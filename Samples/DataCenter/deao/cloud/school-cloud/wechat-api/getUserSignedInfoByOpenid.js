//公众号进入，通过当前进入用户的微信openid，获取当前登录用户（老师/学生）的详细信息
Parse
    .Cloud
    .define('getUserSignedInfoByOpenid', (request, response) => {
        const openid = request.params.oid; //公众号进入的用户的openid

        const bindings_query = new Parse.Query("Bindings");
        const student_query = new Parse.Query("Student");
        const teacher_query = new Parse.Query("Teacher");
        const classes_query = new Parse.Query("Classes");
        const faculty_query = new Parse.Query("Faculty");
        const school_query = new Parse.Query("School");
        /**
     * signStudent -- 标识进入的用户是否为学生
     * user_type  --  用户的类型（老师/学生）
     * user_schoolid -- 绑定的用户，所绑定的学校id，此id为在绑定表中查询获得
     * user_number -- 绑定的用户，其学号/工号。内容为查询获得
     * user_faculty_id -- 绑定用户的院系id
     * user_classes_id -- 绑定用户的班级id（只有学生用户有此ID）
     */
        var signStudent = false,
            user_type,
            user_schoolid,
            user_number,
            user_faculty_id,
            user_classes_id,
            teacher,
            student,
            classes,
            faculty,
            school;

        bindings_query.equalTo("bind_open_id", openid);
        bindings_query
            .find({useMasterKey: true})
            .then((boundUsers) => {
                user_type = boundUsers[0].get("bind_type");
                user_number = boundUsers[0].get("bind_number");
                user_schoolid = boundUsers[0].get("bind_school_id");

                console.log("bindings", user_type, user_number, user_schoolid);

                if (user_type == "老师") {
                    teacher_query.equalTo("tcher_school_id", user_schoolid);
                    teacher_query.equalTo("tcher_number", user_number);

                    teacher_query
                        .find({useMasterKey: true})
                        .then((user_teachers) => {
                            teacher = user_teachers[0];
                            user_faculty_id = teacher.get("tcher_faculty_id");
                            return faculty_query.get(user_faculty_id, {useMasterKey: true});
                        })
                        .then((faculty_teacher) => {
                            faculty = faculty_teacher;
                            return school_query.get(user_schoolid, {useMasterKey: true});
                        })
                        .then((school_teacher) => {
                            school = school_teacher;
                            response.success({
                                "signStudent": signStudent,
                                "student": student,
                                "teacher": teacher,
                                "classes": classes,
                                "faculty": faculty,
                                "school": school
                            });
                        });
                } else if (user_type == "学生") {

                    student_query.equalTo("stu_number", user_number);
                    student_query.equalTo("stu_school_id", user_schoolid);

                    student_query
                        .find({useMasterKey: true})
                        .then((user_students) => {
                            student = user_students[0];
                            signStudent = true;
                            user_classes_id = student.get("stu_classes");
                            return classes_query.get(user_classes_id, {useMasterKey: true});
                        })
                        .then((classes_student) => {
                            classes = classes_student;
                            user_faculty_id = classes.get("cla_faculty");
                            return faculty_query.get(user_faculty_id, {useMasterKey: true});
                        })
                        .then((faculty_student) => {
                            faculty = faculty_student;
                            return school_query.get(user_schoolid, {useMasterKey: true});
                        })
                        .then((school_student) => {
                            school = school_student;
                            response.success({
                                "signStudent": signStudent,
                                "student": student,
                                "teacher": teacher,
                                "classes": classes,
                                "faculty": faculty,
                                "school": school
                            });
                        });
                }
            })
            .catch((error) => {
                response.error(error);
            });

    });