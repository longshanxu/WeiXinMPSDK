  
Parse
  .Cloud
  .define("getHardWare", function (request, response) {
        
            var cq= new Parse.Query("Campus");
            var tq = new Parse.Query("TeachingBuilding");
            var hq = new Parse.Query("HardWare");
            var crq=new Parse.Query("ClassRoom");
            var school_id=request.params.hw_school_id;
            console.log(school_id);
            var hwArr=[];
            hq.equalTo("hw_school_id",school_id);
            hq.find({useMasteerKey:true}).then((hardware)=>{
                        hardware.map((v,k)=>{
                                var hardware={
                                    "objectId":v.id,
                                    "hw_number":v.get("hw_number"),
                                    "hw_name":v.get("hw_name"),
                                    "hw_address":v.get("hw_address"),                                    
                                    "hw_status":v.get("hw_status"),                                    
                                    "hw_major":v.get("hw_major"),                                    
                                    "hw_minor":v.get("hw_minor"),                                    
                                    "hw_uuid":v.get("hw_uuid"),                                    
                                    "hw_campus_id":v.get("hw_campus_id"),                                    
                                    "hw_building_id":v.get("hw_building_id"),                                    
                                    "hw_location":v.get("hw_location"),                                    
                                    "hw_url":v.get("hw_url"),                                    
                                    "hw_location_name":""
                                }
                              hwArr.push(hardware);
                        });
                          
            }).then(()=>{
                    
                  cq.find({useMasterKey:true}).then((campus)=>{
                            campus.map((v,k)=>{
                                for(var i=0;i<hwArr.length;i++){
                                var tb=hwArr[i];
                                if(tb.hw_campus_id==v.id){
                                        tb.hw_location_name=v.get("cam_name");
                                }
                             }
                         })
                    })
            
            }).then(()=>{
                    tq.find({useMasteerKey:true}).then((tb)=>{
                    tb.map((v,k)=>{
                         for(var i=0;i<hwArr.length;i++){
                                var tb=hwArr[i];
                                if(tb.hw_building_id==v.id){
                                        tb.hw_location_name=v.get("tb_name");
                                }
                         }
                    });                
                })
            }).then(()=>{
                        crq.find({useMasterKey:true}).then((cr)=>{
                                cr.map((v,k)=>{
                                for(var i=0;i<hwArr.length;i++){
                                var tb=hwArr[i];
                                if(tb.hw_location==v.id){
                                        tb.hw_location_name+=v.get("cr_name");
                                        console.log(tb.hw_location_name);
                                }
                             }
                         });
                         
                         response.success(hwArr);
                     })
            })


  });