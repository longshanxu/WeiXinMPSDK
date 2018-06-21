//获取学生信息及其所关联信息
Parse
    .Cloud
    .define("getStuInfoAllByStuid", function (request, response) {
        const openid = request.params.oid;
        const schoolObjectId = request.params.schoolobjectid;
        const userObjectId = request.params.userobjectid;
        const student_query = new Parse.Query("Student");
        let studentInfo,
            classesInfo,
            facultyInfo,
            schoolInfo;
        const classes_query = new Parse.Query("Classes");
        const faculty_query = new Parse.Query("Faculty");
        const school_query = new Parse.Query("School");

        //如果传递来了学生的objectid
        if (userObjectId != undefined) {

            student_query
                .get(userObjectId, {useMasterKey: true})
                .then((student) => {
                    studentInfo = student;

                    const classesid = student.get("stu_classes");
                    return classes_query.get(classesid, {useMasterKey: true});
                })
                .then((classes) => {
                    classesInfo = classes;

                    const facultyid = classes.get("cla_faculty");
                    return faculty_query.get(facultyid, {useMasterKey: true});
                })
                .then((faculty) => {
                    facultyInfo = faculty;

                    const schoolid = faculty.get("fac_school_id");
                    return school_query.get(schoolid, {useMasterKey: true});
                })
                .then((school) => {
                    schoolInfo = school;

                    response.success({"student": studentInfo, "classes": classesInfo, "faculty": facultyInfo, "school": schoolInfo});
                })
                .catch((error) => {
                    response.error(error);
                });
        } else {
            //如果没有传进来学生的objectid，则通过学生的openid来查找学校id和学号id，以此来查找学生的objectid；
            const bindings_query = new Parse.Query("Bindings");
            // console.log("openid:", openid); console.log("schoolObjectId:",
            // schoolObjectId);

            bindings_query.equalTo("bind_open_id", openid);

            bindings_query
                .find({useMasterKey: true})
                .then((bindingsResults) => {
                    const stuSchoolId = bindingsResults[0].get("bind_school_id");
                    const stuNumber = bindingsResults[0].get("bind_number");
                    student_query.equalTo("stu_school_id", stuSchoolId);
                    student_query.equalTo("stu_number", stuNumber);

                    return student_query.find({useMasterKey: true});
                })
                .then((studentResults) => {
                    studentInfo = studentResults[0];

                    const classesid = studentResults[0].get("stu_classes");
                    return classes_query.get(classesid, {useMasterKey: true});
                })
                .then((classes) => {
                    classesInfo = classes;

                    const facultyid = classes.get("cla_faculty");
                    return faculty_query.get(facultyid, {useMasterKey: true});
                })
                .then((faculty) => {
                    facultyInfo = faculty;

                    const schoolid = faculty.get("fac_school_id");
                    return school_query.get(schoolid, {useMasterKey: true});
                })
                .then((school) => {
                    schoolInfo = school;

                    response.success({"student": studentInfo, "classes": classesInfo, "faculty": facultyInfo, "school": schoolInfo});
                })
                .catch((error) => {
                    response.error(error);
                });
        }
    });