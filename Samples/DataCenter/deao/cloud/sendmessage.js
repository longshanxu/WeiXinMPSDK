var http = require('http');
//console.log(http);
// 修改为您的短信账号
var account="N8807679";
// 修改为您的短信密码
var password="A0akn7bsgHf72e";
// 修改您要发送的手机号码，多个号码用逗号隔开
var phone="15221261174";
// 修改为您要发送的短信内容
var msg="\u3010\u5F97\u5965\u3011\u60A8\u597D\uFF0C\u60A8\u7684\u9A8C\u8BC1\u7801\u662F";
// var msg="test";
// 短请求地址请登录253云通讯自助通平台查看或者询问您的商务负责人获取
var sms_host = 'smsbj1.253.com';
// 发送短信地址
var send_sms_uri = '/msg/send/json';

// 发送短信方法
module.exports = function send_sms(phone,code){
	
    var post_data = { // 这是需要提交的数据 
    'account': account,   
    'password': password, 
    'phone':phone,
    'msg':msg+code,
    'report':'false',
    };  
    var content =  JSON.stringify(post_data);  
    post(send_sms_uri,content,sms_host);
	
}

function post(uri,content,host){
   
	var options = {  
        hostname: host,
        port: 80,  
        path: uri,  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json; charset=UTF-8', 
        }  
    };

    var req = http.request(options, function (res) {  
        console.log('STATUS: ' + res.statusCode);  
        
        res.setEncoding('utf8');  
        res.on('data', function (chunk) {  
            console.log('BODY: ' + chunk);  
        });  
    }); 
   
    req.write(content);  
  
    req.end();   
} 



 //send_sms(send_sms_uri,account,password,phone,msg);
