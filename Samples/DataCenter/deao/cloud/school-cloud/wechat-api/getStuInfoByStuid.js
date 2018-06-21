//获取学生信息
Parse
    .Cloud
    .define("getStuInfoByStuid", function(request, response) {
        const openid = request.params.oid;
        const schoolObjectId = request.params.schoolobjectid;
        const userObjectId = request.params.userobjectid;
        const student_query = new Parse.Query("Student");

        //如果传递来了学生的objectid
        if (userObjectId != undefined) {
            student_query
                .get(userObjectId, { useMasterKey: true })
                .then((object) => {
                    response.success(object);
                })
                .catch((error) => {
                    response.error(error);
                });
        } else {
            //如果没有传进来学生的objectid，则通过学生的openid来查找学校id和学号id，以此来查找学生的objectid；
            const bingings_query = new Parse.Query("Bindings");
            //console.log("openid:", openid);
            //console.log("schoolObjectId:", schoolObjectId);

            bingings_query.equalTo("bind_open_id", openid);
            bingings_query
                .find({
                    success: function(results) {
                        for (var i = 0, l = results.length; i < l; i++) {
                            var object = results[i];
                            var stuSchoolId = object.get("bind_school_id");
                            var stuNumber = object.get("bind_number");
                        };
                        // Student表通过stuSchoolId和stuNumber查询学生信息
                        student_query.equalTo("stu_school_id", stuSchoolId);
                        student_query.equalTo("stu_number", stuNumber);
                        student_query.find({
                            success: function(results) {
                                response.success(results[0]);
                            },
                            error: function(error) {
                                response.error(error);
                            },
                            useMasterKey: true
                        });
                    },
                    error: function(error) {
                        response.error(error);
                    },
                    useMasterKey: true
                })
                .catch((error) => {
                    response.error(error);
                });
        }
    });