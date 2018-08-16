var Decimal = require("decimal.js");
Parse
    .Cloud
    .define("cpu", (request, response) => {
        var GameScore = Parse
            .Object
            .extend("Result");
        var query = new Parse.Query(GameScore);
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var datetemp = year + "-" + month + "-" + day;
        if (month < 10) {
            datetemp = year + "-0" + month + "-" + day;
        }
        query.equalTo("today", datetemp);
        query.ascending("serial_no")
        query.find({
            success: function (results) {
                var array = [];
                for (let index = 0; index < results.length; index++) {
                    const element = results[index];
                    //获取开赛时间
                    var serial_no = element.get("serial_no");
                    //获取编号
                    var match_time = element.get("match_time");
                    match_time
                    var yourtime = match_time;
                    yourtime = yourtime.replace("-", "/"); //替换字符，变成标准格式
                    var d2 = new Date(); //取今天的日期
                    var d1 = new Date(Date.parse(yourtime));
                    // if (d1 < d2) {
                    //     continue;
                    // }
                    //获取威廉数据
                    var weilian = element.get("weilian");
                    var weilianshuju = "";
                    //威廉数据看胜负
                    if (weilian) {
                        var weilianarray = weilian.split("-");
                        var weiliansheng = weilianarray[3] - weilianarray[0] > 0
                            ? "不看胜"
                            : "胜";
                        var weilianping = weilianarray[4] - weilianarray[1] > 0
                            ? "不看平"
                            : "平";
                        var weilianfu = weilianarray[5] - weilianarray[2] > 0
                            ? "不看负"
                            : "负";

                        weilianshuju = weiliansheng + "," + weilianping + "," + weilianfu;

                    } else {
                        //数据缺失
                        continue;
                    }

                    //获取inter数据
                    var interwetten = element.get("interwetten");
                    var interwettenshuju = "";
                    if (interwetten) {

                        var interwettenarray = interwetten.split("-");
                        var interwettensheng = interwettenarray[3] - interwettenarray[0] > 0
                            ? "不看胜"
                            : "胜";
                        var interwettenping = interwettenarray[4] - interwettenarray[1] > 0
                            ? "不看平"
                            : "平";
                        var interwettenfu = interwettenarray[5] - interwettenarray[2] > 0
                            ? "不看负"
                            : "负";

                        interwettenshuju = interwettensheng + "," + interwettenping + "," + interwettenfu;
                    } else {
                        //数据缺失
                        continue;
                    }

                    //获取易胜博数据
                    var yishengbo = element.get("yishengbo");
                    var yishengboshuju = "";
                    if (yishengbo) {
                        var yishengboarray = yishengbo.split("-");
                        var yishengbosheng = yishengboarray[3] - yishengboarray[0] > 0
                            ? "不看胜"
                            : "胜";
                        var yishengboping = yishengboarray[4] - yishengboarray[1] > 0
                            ? "不看平"
                            : "平";
                        var yishengbofu = yishengboarray[5] - yishengboarray[2] > 0
                            ? "不看负"
                            : "负";

                        yishengboshuju = yishengbosheng + "," + yishengboping + "," + yishengbofu;
                    } else {
                        //数据缺失
                        continue;
                    }

                    //获取威廉和inter的数据对比
                    var sheetshuju = "";
                    if (weilian && interwetten) {
                        var weilianarray = weilian.split("-");
                        var interwettenarray = interwetten.split("-");

                        var sheet1 = new Decimal(weilianarray[3])
                            .sub(new Decimal(interwettenarray[3]))
                            .toNumber();
                        var sheet2 = new Decimal(weilianarray[4])
                            .sub(new Decimal(interwettenarray[4]))
                            .toNumber();
                        var sheet3 = new Decimal(weilianarray[5])
                            .sub(new Decimal(interwettenarray[5]))
                            .toNumber();

                        var array1 = [sheet1, sheet2, sheet3];

                        array1.sort(function (a, b) {
                            return a - b;
                        });
                        var array = [];

                        var sheet1flag = true;
                        var sheet2flag = true;
                        var sheet3flag = true;

                        for (let x = 0; x < array1.length; x++) {

                            const element = array1[x];

                            if (x == array1.length - 1) {
                                if (array1[x] == array1[x-1]) {
                                    sheetshuju += "数据相同(" + array1[x] + ")";
                                    break;
                                }else if( x == 2){
                                    if(sheet1flag){
                                        sheetshuju += "不压胜(" + array1[x] + ")"
                                    }
                                    if(sheet2flag){
                                        sheetshuju += "不压平(" + array1[x] + ")"
                                    }
                                    if(sheet3flag){
                                        sheetshuju += "不压负(" + array1[x] + ")";
                                    }
                                    break;
                                }
                                 
                            }

                            if (element == sheet1) {
                                if(sheet1flag){
                                    sheetshuju += "压胜(" + element + "),";
                                    sheet1flag = false;
                                    continue;
                                }
                                

                            }
                            if (element == sheet2) {
                                if(sheet2flag){
                                sheetshuju += "压平(" + element + "),";
                                sheet2flag = false;
                                continue;
                                }
                            }
                            if (element == sheet3) {
                                if(sheet3flag){
                                sheetshuju += "压负(" + element + "),";
                                sheet3flag =false;
                                continue;
                                }
                                
                            }

                        }

                    } else {
                        continue;
                    }

                    //获取交易数据
                    var yinglishuju = "";
                    var yingli = element.get("yingli");
                    if (yingli) {
                        var yingliarray = yingli.split(";");

                        var yinglisheng = yingliarray[0].replace(new RegExp(',', "g"), "") > 0
                            ? "胜"
                            : "亏胜";
                        var yingliping = yingliarray[1].replace(new RegExp(',', "g"), "") > 0
                            ? "平"
                            : "亏平";
                        var yinglifu = yingliarray[2].replace(new RegExp(',', "g"), "") > 0
                            ? "负"
                            : "亏负";
                        yinglishuju = yinglisheng + "," + yingliping + "," + yinglifu;
                    } else {
                        //数据缺失
                        continue;
                    }
                    console.log("******************************************************");
                    console.log("开赛编号:" + serial_no + "---开赛时间:" + match_time);
                    console.log("第一组数据:" + weilianshuju + "--" + interwettenshuju)
                    console.log("第二组数据:" + yishengboshuju);
                    console.log("第三组数据:" + yinglishuju);
                    console.log("第四组数据:" + sheetshuju);
                }

                response.success("OK");
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    });