//教师上课教室分布
const percent = require("../reportform-api/GetPercent");
Parse
.Cloud
.define('teacherWorkingClassroom', (request, response) => {
        var  cq  = new  Parse.Query("Calendar");
        var crq = new Parse.Query("ClassRoom");
        var roomArr=[];
        var crArr=[];
        var rateArr=[];
        var schoolid=request.params.schoolid; 
        cq.equalTo("cal_school_id",schoolid);
        cq.equalTo("cal_term","2017-2018（1）");  
        cq.equalTo("cal_state","课后");
        cq.find({useMasterKey:true}).then((cal)=>{
                    cal.map((v,k)=>{
                                roomArr.push(v.get("cal_room"));
                    });

        var arr = [];
        roomArr.sort();
         for (var i = 0; i < roomArr.length;) {         //获得重复教室的数量
                var count = 0;
                for (var j = i; j < roomArr.length; j++) {
                if (roomArr[i] === roomArr[j]) {
                    count++;
                }
                }
                arr.push({
                id: roomArr[i],
                count: count
                })
                i+=count;
            }
            crq.find({useMasterKey:true}).then((room)=>{        //获得教室名称跟分布率
                room.map((v,k)=>{
                        roomObj={
                                "roomName":v.get("cr_name"),
                                "roomid":v.id
                        };
                    crArr.push(roomObj);
                });
                arr.map((v,k)=>{
                        var obj={};
                        crArr.map((n,i)=>{
                                if(v.id==n.roomid){
                                        obj.roomName=n.roomName;                 
                                        obj.rate=v.count;
                                }
                        });
                    rateArr.push(obj);
                    
                });
       response.success(rateArr);
        }).catch((e)=>{
                response.error(e);
        });
               
        }).catch((e)=>{
                response.error(e);
        })
});