
Parse
  .Cloud
  .define("getAllTeacher", function (request, response) {
        
            var fac= new Parse.Query("Faculty");
            var tq = new Parse.Query("Teacher");
            var school_id=request.params.tcher_school_id;
            var teaArr=[];
            tq.equalTo("tcher_school_id",school_id);
            tq.limit(1000);
            tq.find({useMasteerKey:true}).then((teacher)=>{
                        teacher.map((v,k)=>{
                                var teacher={
                                    "objectId":v.id,
                                    "tcher_number":v.get("tcher_number"),
                                    "tcher_name":v.get("tcher_name"),
                                    "tcher_gender":v.get("tcher_gender"),
                                    "tcher_birthday":v.get("tcher_birthday"),
                                    "tcher_school_time":v.get("tcher_school_time"),
                                    "tcher_education":v.get("tcher_education"),
                                    "tcher_technical":v.get("tcher_technical"),
                                    "tcher_university":v.get("tcher_university"),
                                    "tcher_positions":v.get("tcher_positions"),
                                    "tcher_mobile":v.get("tcher_mobile"),
                                    "tcher_avatar":v.get("tcher_avatar"),
                                    "tcher_remark":v.get("tcher_remark"),
                                    "tcher_faculty_id":v.get("tcher_faculty_id"),
                                    "tcher_degree":v.get("tcher_degree"),
                                    "faculty":""
                                }
                              teaArr.push(teacher);
                        });
                          
            }).then(()=>{
                    
                    fac.find({useMasteerKey:true}).then((faculty)=>{
                    faculty.map((v,k)=>{
                         for(var i=0;i<teaArr.length;i++){
                                var teacher=teaArr[i];
                                if(teacher.tcher_faculty_id==v.id){
                                        teacher.faculty=v.get("fac_name");
                                }
                         }
                    });
                    console.log("abc:",teaArr);
                    response.success(teaArr);
            })
            
            })

  });