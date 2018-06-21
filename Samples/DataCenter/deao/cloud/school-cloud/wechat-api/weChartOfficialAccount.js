  /**
   * 微信公众号进入课程表的接口
   * 1.没有注册时进入   2.注册后进入
   */
  Parse.Cloud.define("verifyUser",(req,res)=>{
    var responseData = "";
    var openId = req.params.openid;
    //利用openid,手机号，学号或工号去注册表中查询信息，判定是否注册过
    var flag = verification(openId);//true-注册过   false-未注册
    
    if(flag){
      responseData = '{"register":"true"}';
    }else{
      responseData = '{"register":"false"}';
    }
    res.success(responseData);
  });


function verification(openid){
qb.find({
         success: function(bindings) {
               console.log(openid);
          for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            var bind_open_id=binding.get("bind_open_id");
               
           if(openid!==bind_open_id){
              //从数据库中匹配openid，如果有则直接跳入课程表
            console.log("未注册");
             return false;
            
           }else{
             //没有则需要注册
            console.log("已注册");
            return  true;
              
           }
            
          }
                },
         error: function(error) {
                 console.log ("失败")    ;
  }

        });
};