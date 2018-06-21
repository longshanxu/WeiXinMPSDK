/**
 * 用户输入验证码后，注册的请求
 */
var registerRedis = require("../../../server/register_redis.js");
var openid_redis = require("../../../server/openid_redis");

//引入处理插入绑定的js文件

Parse
    .Cloud
    .define("register", (req, res) => {

        var responseData = "";

        var phoneNumber = req.params.m; //注册手机号
        var number = req.params.no; //注册人工号/学号
        var userName = req.params.name; //注册用户名
        var code = req.params.c; //注册人填入的验证码
        var openid = req.params.oid;//获取微信的openid
        var schoolid = req.params.sid;//获取的学校objectId

        try {
            verify(phoneNumber,openid,number,schoolid,code,(data)=>{
                var v = data.value;//验证是否通过，value--Boolean
                responseData = data.message;
                if(v){
                    insertToBindings(phoneNumber, number, data.state, data.bind_type, openid, undefined, schoolid);
                    res.success(JSON.parse(responseData));
                }else{
                    res.success(JSON.parse(responseData));
                }
                
            });
        } catch (e) {
            res.error(e);
        }

    });

    //把数据插入到绑定表中
function insertToBindings(mobile,number,state,type,open_id,remark,schoolid){
        var Bindings = Parse.Object.extend("Bindings");
        var bindings = new Bindings();

        bindings.set("bind_mobile",mobile);
        bindings.set("bind_number",number);
        bindings.set("bind_state",state);
        bindings.set("bind_type",type);
        bindings.set("bind_open_id",open_id);
        bindings.set("bind_remark",remark);
        bindings.set("bind_school_id",schoolid);
        bindings.save(null,{
            success:(obj)=>{
                //以学校，学生学号/老师工号为key，其openid为value，存放在redis中
                openid_redis.setOpenid(obj.get('bind_school_id'),obj.get('bind_number'),obj.get('bind_open_id'));
            },
            error:(e)=>{
                
            },
            useMasterKey:true
        });

};

//验证提交的信息，1.是否重复注册，2.验证码是否正确
/**
 * 
 * phoneNumber 手机号
 * openId 微信的openId
 * number 工号/学号
 * schoolId 学校的ObjectId
 */
function verify(phoneNumber,openid,number,schoolid,code,callback){
    var responseData = "";
    registerRedis.getCode(phoneNumber,(_code)=>{
        
            //找到验证码
            //验证验证码是否输入正确
            if (_code == code) {
                //验证码正确，插入绑定
                //检测用户身份：学生或者老师
                var bind_type = "";
                var teacherSearch = new Parse.Query("Teacher");
                teacherSearch.equalTo("tcher_school_id",schoolid);
                teacherSearch.equalTo("tcher_number",number);

                var studentSearch = new Parse.Query("Student");
                studentSearch.equalTo("stu_number",number);
                studentSearch.equalTo("stu_school_id",schoolid);

                var isStudent = false;
                var isTeacher = false;

                teacherSearch
                .find({useMasterKey: true})
                .then((result)=>{
                    
                    if(result.length > 0) isTeacher = true;

                    return studentSearch.find({useMasterKey:true});

                }).then((result)=>{
                    if(result.length >0) isStudent = true;


                    if(isStudent || isTeacher){
                        bind_type = isStudent ? "学生" : "老师";
                        var state = "使用";

                        //在这里，根据手机号，微信openid，工号/学号，去判断，是否已经绑定过
                        const phone_bind_query = new Parse.Query('Bindings');
                        phone_bind_query.equalTo('bind_school_id',schoolid);
                        phone_bind_query.equalTo('bind_mobile',phoneNumber);

                        const wechat_bind_query = new Parse.Query('Bindings');
                        wechat_bind_query.equalTo('bind_school_id',schoolid);
                        wechat_bind_query.equalTo('bind_open_id',openid);

                        const number_bind_query = new Parse.Query('Bindings');
                        number_bind_query.equalTo('bind_school_id',schoolid);
                        number_bind_query.equalTo('bind_number',number);

                        const bind_query = Parse.Query.or(phone_bind_query,wechat_bind_query,number_bind_query);
                        bind_query.find({useMasterKey:true}).then((binds)=>{
                            const length = binds.length;
                            //如果查询到结果，说明相关的手机号，微信openid，工号/学号已经被注册了
                            if(length > 0){
                                //203--重复注册
                                responseData = '{"code":"500","event":"203"}';
                                
                                callback({'value':false,'message':responseData});
                            }else{
                                //200 -- 成功
                                responseData = '{"code":"200","event":"200"}';
                                
                                callback({'value':true,'message':responseData,'bind_type':bind_type,"state":state});
                            }
                        }).catch((e)=>{
                            throw new Error(e);
                        });
                        
                    }else{
                        //202 -- 验证码不匹配
                        responseData = '{"code":"500","event":"202"}';
                        callback({'value':false,'message':responseData});
                    }

                }).catch((e)=>{
                    
                    throw new Error(e);

                })
            } else {
                //验证码不正确
                responseData = '{"code":"500","event":"202"}';
                callback({'value':false,'message':responseData});
            }           
        
    });    
}

//本接口的旧代码，可行的代码

// function old_code_but_running(){
    // Parse
    // .Cloud
    // .define("register", (req, res) => {

    //     var responseData = "";

    //     var phoneNumber = req.params.m; //注册手机号
    //     var number = req.params.no; //注册人工号/学号
    //     var userName = req.params.name; //注册用户名
    //     var code = req.params.c; //注册人填入的验证码
    //     var openid = req.params.oid;//获取微信的openid
    //     var schoolid = req.params.sid;//获取的学校objectId

    //     registerRedis.getCode(phoneNumber,(_code)=>{

    //             //找到验证码
    //             //验证验证码是否输入正确
    //             if (_code == code) {
    //                 //验证码正确，插入绑定
    //                 //检测用户身份：学生或者老师
    //                 var bind_type = "";
    //                 var teacherSearch = new Parse.Query("Teacher");
    //                 teacherSearch.equalTo("tcher_school_id",schoolid);
    //                 teacherSearch.equalTo("tcher_number",number);

    //                 var studentSearch = new Parse.Query("Student");
    //                 studentSearch.equalTo("stu_number",number);
    //                 studentSearch.equalTo("stu_school_id",schoolid);

    //                 var isStudent = false;
    //                 var isTeacher = false;

    //                 teacherSearch
    //                 .find({useMasterKey: true})
    //                 .then((result)=>{
                        
    //                     if(result.length > 0) isTeacher = true;

    //                     return studentSearch.find({useMasterKey:true});

    //                 }).then((result)=>{
    //                     if(result.length >0) isStudent = true;


    //                     if(isStudent || isTeacher){
    //                         bind_type = isStudent ? "学生" : "老师";
    //                         var state = "使用";

    //                         //在这里，根据手机号，微信openid，工号/学号，去判断，是否已经绑定过
    //                         const phone_bind_query = new Parse.Query('Bindings');
    //                         phone_bind_query.equalTo('bind_school_id',schoolid);
    //                         phone_bind_query.equalTo('bind_mobile',phoneNumber);

    //                         const wechat_bind_query = new Parse.Query('Bindings');
    //                         wechat_bind_query.equalTo('bind_school_id',schoolid);
    //                         wechat_bind_query.equalTo('bind_open_id',openid);

    //                         const number_bind_query = new Parse.Query('Bindings');
    //                         number_bind_query.equalTo('bind_school_id',schoolid);
    //                         number_bind_query.equalTo('bind_number',number);

    //                         const bind_query = Parse.Query.or(phone_bind_query,wechat_bind_query,number_bind_query);
    //                         bind_query.find({useMasterKey:true}).then((binds)=>{
    //                             const length = binds.length;
    //                             if(length > 0){
    //                                 responseData = '{"code":"500","event":"203"}';
    //                                 res.success(JSON.parse(responseData));
    //                             }else{
    //                                 insertToBindings(phoneNumber, number, state, bind_type, openid, undefined, schoolid);
    //                                 responseData = '{"code":"200","event":"200"}';
    //                                 res.success(JSON.parse(responseData));
    //                             }
    //                         }).catch((e)=>{
    //                             res.error(e);
    //                         });
                            
    //                     }else{
    //                         responseData = '{"code":"500","event":"202"}';
    //                         res.success(JSON.parse(responseData));
    //                     }

    //                 }).catch((e)=>{
    //                     res.error(e);
    //                 })
    //             } else {
    //                 //验证码不正确
    //                 responseData = '{"code":"500","event":"202"}';
                    
    //                 res.success(JSON.parse(responseData));
    //             }           
          
    //     });
        


    // });   
// }