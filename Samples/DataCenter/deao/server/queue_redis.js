//课前，课后提醒的课程objectId和queue的type关系数据保存
var redis = require('redis');

var redis_host = 'svdeao.redis.cache.chinacloudapi.cn';           // redis 服务器host
var redis_prot = 6379;                  // redis端口


const client = redis.createClient(redis_prot, redis_host, 
    {
        auth_pass:"DFzFC3Gk47mnjykT5EpQcRKawb+04kelOwCkm8kKIoY=",
        db:6
    });

module.exports.setCode = function setCode(key,value){
    client.set(key, value);
}

module.exports.getCode =function getCode(key,callback){
    client.get(key, function(err, data){

        if(!err) callback(data);                                                      // redis 发生错误
        
    });
}

module.exports.deleteCode = function deleteCode(key,callback){
    client.exists(key,(err,reply)=>{
        // reply = 1 exist, reply = 0 no exist
        if (err) {
            callback(false);
            return;
        }
        if(reply == 1) {
            client.del(key,(err,reply)=>{
                if (err) {
                    callback(false);
                    return;
                }  
                
                reply == 1 ? callback(true) : callback(false)

            });
        }else{
            callback(false);
        }

    });
};