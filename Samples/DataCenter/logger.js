let log4js = require("log4js");

let logConfig = {
    appenders: {
        out: { type: 'console' },
        resLogger: {
            "type": "dateFile",
            "filename": "./logs/response/resLogger",
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd.log",
            "path": "./logs/response"
        },
        errorLogger: {
            "type": "dateFile", //日志类型
            "filename": "./logs/error/errorLogger", //日志输出位置
            "alwaysIncludePattern": true, //是否总是有后缀名
            "pattern": "-yyyy-MM-dd.log", //后缀，每天创建一个新的日志文件
            "path": "./logs/error" //自定义属性，错误日志的根目录
        }
    },
    categories: {
        default: { 
            appenders: ['out'],
            level: 'info' 
        },
        resLogger: {
            appenders: ["resLogger"],
            level: "info"
        },
        errorLogger: {
            appenders: ["errorLogger"],
            level: "error"
        }
    }
};

log4js.configure(logConfig);

let resLogger = log4js.getLogger("resLogger");
let errorLogger = log4js.getLogger("errorLogger");

//格式化请求日志
let formatReqLog = function (req) {
    
    let logText = new String();
    // 访问路径
    logText += "request url: " + req.headers.host + "\n";
    // 请求参数类型
    logText += "request params type" + typeof req.params + "\n";
    // 请求参数
    logText += "request params: "  + "\n" + JSON.stringify(req.params) + "\n";
    // 请求方法
    logText += "request function: " + req.functionName + "\n";    
    // 客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    return logText;

};

//格式化响应日志
let formatRes = function (req, res) {
    let logText = new String();
    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";
    //添加请求日志
    logText += formatReqLog(req);
    //响应
    if(res) {
        switch(typeof res) {
            case "string":
                logText += "response value: " + res + "(字符串)\n";
                break;
            case "number":
                logText += "response value: " + res + "(数值)\n";
                break;                   
            case "boolean": 
                logText += "response value: " + res + "(布尔值)\n";   
                break;
            case "function":
                logText += "response value: " + res + "(函数)\n";
                break;
            default:
                logText += "response value: " + JSON.stringify(res) + "(对象)\n";
        }
    } else {
        logText += "response value: 未拿到返回值\n";
    }
    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    return logText;

};

//格式化错误日志
let formatError = function (req = {}, error = {}) {
    let logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    if (JSON.stringify(req) != "{}") {
        logText += formatReqLog(req);
    }
    if (JSON.stringify(error) != "{}") {
        //错误名称
        logText += "err code: " + error.code + "\n";
        //错误信息
        logText += "err message: " + error.message + "\n";
    } else {
        logText += "err: 未拿到错误信息\n";
    }
    //错误信息结束
    logText += "*************** error log end ***************" + "\n";
    return logText;
};

let logUtil = {

    logError(error, req) {
        if(error) {
            errorLogger.error(formatError(req, error));
        }
    },

    logResponse(req, res) {
        if(req) {
            resLogger.info(formatRes(req, res));
        }
    },

    use(app) {
        app.use(log4js.connectLogger(resLogger, {level: "info", format: ":method :url"}));
        app.use(log4js.connectLogger(errorLogger, {level: "error", format: ":method :url"}));
    }

}

module.exports = logUtil;