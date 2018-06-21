//教师职位分布
Parse
.Cloud
.define('teachersPosition', (request, response) => {



    var datas = [];
    var positions = {};
    const teacher_query = new Parse.Query('Teacher');
    var schoolid = request.params.schoolid;
    teacher_query.equalTo('tcher_school_id',schoolid);

    teacher_query.find({useMasterKey:true}).then((results)=>{
      results.map((v,k)=>{
        if(positions.hasOwnProperty(v.get('tcher_positions'))){
          positions[v.get('tcher_positions')] += 1;
        }else{
          positions[v.get('tcher_positions')] = 1;
        }
      });
      
    }).then(()=>{
      for(var p in positions){
        datas.push({'position':p,'posCount':positions[p]});
      }

      response.success(datas);
    }).catch((e)=>{
      response.error(e);
    });

});