//教师学位分布
Parse
.Cloud
.define('teacherEducation_data', (request, response) => {

console.log('xxxxxxxxxxxxxx');
  var datas = [];
  var degrees = {};
  const teacher_query = new Parse.Query('Teacher');
  var schoolid = request.params.schoolid;
  teacher_query.equalTo('tcher_school_id',schoolid);

  teacher_query.find({useMasterKey:true}).then((results)=>{
    results.map((v,k)=>{
      if(degrees.hasOwnProperty(v.get('tcher_education'))){
        degrees[v.get('tcher_education')] += 1;
      }else{
        degrees[v.get('tcher_education')] = 1;
      }
    });
    
  }).then(()=>{
    for(var p in degrees){
      datas.push({'education':p,'eduCount':degrees[p]});
    }

    response.success(datas);
  }).catch((e)=>{
    response.error(e);
  });


});