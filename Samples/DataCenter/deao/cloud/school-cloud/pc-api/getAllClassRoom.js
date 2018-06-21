
Parse
  .Cloud
  .define("getAllClassRoom", function (request, response) {
            var rq =new Parse.Query("ClassRoom");
            var tq= new Parse.Query("TeachingBuilding");
            var hq=new Parse.Query("HardWare");
            var school_id=request.params.cr_school_id;
             var roomArr=[]; 
            rq.equalTo("cr_school_id",school_id);
            rq.limit(1000);
            rq.find({useMasterKey:true}).then((room)=>{                 
                    room.map((v,k)=>{
                            var cr={
                                "objectId":v.id,
                                "cr_name":v.get("cr_name"),
                                "cr_seat":v.get("cr_seat"),
                                "cr_teachingbuilding_id":v.get("cr_teachingbuilding_id"),
                                "cr_profiles":v.get("cr_profiles"),
                                "cr_type":v.get("cr_type"),
                                "cr_floor":v.get("cr_floor"),
                                "cr_device_id":v.get("cr_device_id"),
                                "cr_teachingbuilding_name":"",
                                "cr_device_name":"",
                            };
                        roomArr.push(cr);
                    });
                     
            }).then(()=>{
                    tq.find({useMasteerKey:true}).then((teachingbuilding)=>{
                        teachingbuilding.map((v,k)=>{
                              for(var i=0;i<roomArr.length;i++){
                                var room=roomArr[i];
                                //console.log(v.get("tb_name"));
                                if(room.cr_teachingbuilding_id==v.id){
                                        room.cr_teachingbuilding_name=v.get("tb_name");
                                      }
                                }
                            });
                            
                        
                        }); 

            }).then(()=>{
                //console.log("ddd");
                    hq.find({useMasterKey:true}).then((hardware)=>{
                        console.log(hardware);
                        var reg = new RegExp("^[0-9]*$");
                            hardware.map((v,k)=>{
                            for(var i=0;i<roomArr.length;i++){
                                var room=roomArr[i];
                                //console.log(v.get("tb_name"));
                               // console.log(v.get("hw_name"));
                               // console.log(v.id);
//console.log(room.cr_device_id);
                                if(room.cr_device_id==v.id){
                                        room.cr_device_name=v.get("hw_name");
                                      }else if(reg.test(room.cr_device_id)){
                                          console.log("ddd");
                                        room.cr_device_name=room.cr_device_id;
                                    }
                                }
                            });
                        //console.log(roomArr);
                        response.success(roomArr);
                    })
            })

  });