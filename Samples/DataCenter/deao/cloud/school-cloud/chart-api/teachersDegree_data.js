//教师学位分布
Parse
.Cloud
.define('teacherDegree', (request, response) => {

  var datas = [];
  var degrees = {};
  const teacher_query = new Parse.Query('Teacher');
  var schoolid = request.params.schoolid;
  teacher_query.equalTo('tcher_school_id',schoolid);

  teacher_query.find({useMasterKey:true}).then((results)=>{
    results.map((v,k)=>{
      if(degrees.hasOwnProperty(v.get('tcher_degree'))){
        degrees[v.get('tcher_degree')] += 1;
      }else{
        degrees[v.get('tcher_degree')] = 1;
      }
    });
    
  }).then(()=>{
    for(var p in degrees){
      datas.push({'degree':p,'degCount':degrees[p]});
    }

    response.success(datas);
  }).catch((e)=>{
    response.error(e);
  });


});