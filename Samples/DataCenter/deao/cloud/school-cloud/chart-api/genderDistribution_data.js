//男女比例数据
Parse
    .Cloud
    .define('genderDistributionData', (request, response) => {
        //查询Student表
        const student_query = new Parse.Query("Student");
        const schoolObjectId = request.params.schoolid;
        //根据学校查询，某一个学校中的学生
        student_query.equalTo("stu_school_id",schoolObjectId);
        var total_count , male_count , female_count;

        student_query.find({useMasterKey:true}).then((students)=>{

            total_count = students.length;

            return student_query.find({useMasterKey:true});
        }).then(()=>{
            student_query.containedIn("stu_gender",["男"]);
            console.log("total_count",total_count);
            student_query.count({
                success:(count)=>{
                    console.log("male_count",count);
                    male_count = count ;
                    female_count = total_count - count;
                    response.success([{"stuSex":"男","stuSexCount":male_count},{"stuSex":"女","stuSexCount":female_count}]);
                },
                error:(error)=>{
                    response.error(error);
                },
                useMasterKey:true
            });

        }).catch((error)=>{
            response.error(error);
        });
    });