
Parse
  .Cloud
  .define("getAllClasses", function (request, response) {
        
            var fac= new Parse.Query("Faculty");
            var cq = new Parse.Query("Classes");
            var school_id=request.params.cla_school_id;
            console.log(school_id);
            var claArr=[];
            cq.equalTo("cla_school_id",school_id);
            cq.limit(1000);
            cq.find({useMasteerKey:true}).then((classes)=>{
                        classes.map((v,k)=>{
                                var classes={
                                    "objectId":v.id,
                                    "cla_name":v.get("cla_name"),
                                    "cla_faculty":v.get("cla_faculty"),
                                    "cla_number":v.get("cla_number"),                                    
                                    "cla_faculty_name":""
                                }
                              claArr.push(classes);
                        });
                          
            }).then(()=>{
                    
                    fac.find({useMasteerKey:true}).then((faculty)=>{
                    faculty.map((v,k)=>{
                         for(var i=0;i<claArr.length;i++){
                                var classes=claArr[i];
                                if(classes.cla_faculty==v.id){
                                        classes.cla_faculty_name=v.get("fac_name");
                                }
                         }
                    });
                    console.log("abc:",claArr);
                    response.success(claArr);
            })
            
            })

  });