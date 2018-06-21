//教师岗位分布
Parse
.Cloud
.define('teacherStation', (request, response) => {


      var datas = [];
      var station = {};
      const teacher_query = new Parse.Query('Teacher');
      var schoolid = request.params.schoolid;
      teacher_query.equalTo('tcher_school_id',schoolid);

      teacher_query.find({useMasterKey:true}).then((results)=>{
        results.map((v,k)=>{
          if(station.hasOwnProperty(v.get('tcher_technical'))){
            station[v.get('tcher_technical')] += 1;
          }else{
            station[v.get('tcher_technical')] = 1;
          }
        });
        
      }).then(()=>{
        for(var p in station){
          datas.push({'station':p,'staCount':station[p]});
        }

        response.success(datas);
      }).catch((e)=>{
        response.error(e);
      });

      

});