//获取所有的教学楼
Parse
  .Cloud
  .define("getAllTeachingBuilding", function (request, response) {
        
            var tq= new Parse.Query("TeachingBuilding");
            var cq = new Parse.Query("Campus");
            var school_id=request.params.tb_school_id;
            console.log(school_id);
            var tbArr=[];
            tq.equalTo("tb_school_id",school_id);
            tq.find({useMasteerKey:true}).then((teachingbuilding)=>{
                        teachingbuilding.map((v,k)=>{
                                var teachingbuilding={
                                    "objectId":v.id,
                                    "tb_name":v.get("tb_name"),
                                    "tb_address":v.get("tb_address"),
                                    "tb_floor":v.get("tb_floor"),                                    
                                    "tb_campus_id":v.get("tb_campus_id"),
                                    "tb_campus_name":""
                                }
                              tbArr.push(teachingbuilding);
                        });
                          
            }).then(()=>{
                    
                    cq.find({useMasteerKey:true}).then((campus)=>{
                    campus.map((v,k)=>{
                         for(var i=0;i<tbArr.length;i++){
                                var teachingbuilding=tbArr[i];
                                if(teachingbuilding.tb_campus_id==v.id){
                                        teachingbuilding.tb_campus_name=v.get("cam_name");
                                }
                         }
                    });
                    console.log("abc:",tbArr);
                    response.success(tbArr);
            })
            
            })

  });