//用户请求短信验证码
var send_sms = require("../../sendmessage");
var registerRedis = require("../../../server/register_redis.js");
Parse
    .Cloud
    .define("requireMessage", (req, res) => {

        // var openid = req.params.oid;//获取微信的openid

        var phoneNumber = req.params.m; //手机号
        var number = req.params.no; //工号/学号
        var userName = req.params.name; //用户名

        //返回的相应数据
        var responseData = "";


        //生成验证码（6位数字）
        const code = parseInt(((Math.random() * 9 + 1) * 100000));
        //获取验证码的内容，然后发送出去 
        send_sms(phoneNumber,code);
        registerRedis.setCode(phoneNumber,code);
        responseData = '{"code":"200","event":"200"}';



        res.success(responseData);


    });
