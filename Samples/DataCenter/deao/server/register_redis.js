/**
 * 注册时，验证码放入到redis中
 */
var redis = require('redis');

var redis_host = 'svdeao.redis.cache.chinacloudapi.cn';           // redis 服务器host
var redis_prot = 6379;                  // redis端口


const client = redis.createClient(redis_prot, redis_host, 
    {
        auth_pass:"DFzFC3Gk47mnjykT5EpQcRKawb+04kelOwCkm8kKIoY=",
        db:5
    });

module.exports.setCode = function setCode(tel,code){
    client.set(tel, code);
}

module.exports.getCode =function getCode(tel,callback){
    client.get(tel, function(err, data){

        if(!err) callback(data);                                                      // redis 发生错误
        
    });
}
