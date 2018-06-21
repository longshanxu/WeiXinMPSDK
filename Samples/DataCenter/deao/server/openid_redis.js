/**
 * 用户完成绑定后，把用户的openid，以学校为单位，学校下，用学生的学号，教师的工号为key,openid为value，存放起来
 */
var redis = require('redis');

var redis_host = 'svdeao.redis.cache.chinacloudapi.cn';           // redis 服务器host
var redis_prot = 6379;                  // redis端口


const client = redis.createClient(redis_prot, redis_host, 
    {
        auth_pass:"DFzFC3Gk47mnjykT5EpQcRKawb+04kelOwCkm8kKIoY=",
        db:7
    });

/**
 * 保存openid到redis中
 * @param {string} schoolid 所在学校的objectid
 * @param {string} number 用户的工号/学号
 * @param {string} openid openid
 */
module.exports.setOpenid = function setOpenid(schoolid,number,openid){
    var key = schoolid+':'+number;
    var code = openid;
    client.set(key, code);
}

/**
 * 
 * @param {string} schoolid 所在学校的objectid
 * @param {string} number 用户的工号/学号
 * @param {function} callback 返回查询结果的函数
 */
module.exports.getOpenid =function getOpenid(schoolid,number,callback){
    var key = schoolid+':'+number;
    client.get(key, function(err, data){
        if(!err) callback(data);
    });
}