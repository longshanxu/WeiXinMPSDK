
Parse
  .Cloud
  .define("getAllStudent", function (request, response) {
            console.log(request.params.stu_school_id);
            var sq= new Parse.Query("Student");
            var cq= new Parse.Query("Classes");
            var fac = new Parse.Query("Faculty");
            var school_id=request.params.stu_school_id;
            var stuArr=[];
            sq.equalTo("stu_school_id",school_id);
            sq.limit(1000);
            sq.find({useMasteerKey:true}).then((student)=>{
                console.log(student);
                        student.map((v,k)=>{
                                var student={
                                    "objectId":v.id,
                                    "stu_number":v.get("stu_number"),
                                    "stu_name":v.get("stu_name"),
                                    "stu_gender":v.get("stu_gender"),
                                    "stu_university":v.get("stu_university"),
                                    "stu_faculty_id":v.get("stu_faculty_id"),
                                    "stu_classes":v.get("stu_classes"),
                                    "stu_idCard":v.get("stu_idCard"),
                                    "stu_address":v.get("stu_address"),
                                    "stu_mobile":v.get("stu_mobile"),
                                    "stu_postcode":v.get("stu_postcode"),                                  
                                    "stu_faculty_name":"",
                                    "stu_class_name":"",
                                }
                              stuArr.push(student);
                        });
                          
            }).then(()=>{
                    
                    fac.find({useMasteerKey:true}).then((faculty)=>{
                    faculty.map((v,k)=>{
                         for(var i=0;i<stuArr.length;i++){
                                var student=stuArr[i];
                                if(student.stu_faculty_id==v.id){
                                        student.stu_faculty_name=v.get("fac_name");
                                }
                         }
                    });
                   
            })
            
            }).then(()=>{
                    cq.find({useMasterKey:true}).then((classes)=>{
                            classes.map((v,k)=>{
                              for(var i=0;i<stuArr.length;i++){
                                var student=stuArr[i];
                                if(student.stu_classes==v.id){
                                        student.stu_class_name=v.get("cla_name");
                                      }
                                }
                            });
                            console.log(stuArr);
                            response.success(stuArr);
                    })
            })

  });