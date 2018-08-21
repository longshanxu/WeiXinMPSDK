var Decimal = require("decimal.js");
var colors = require('colors');
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
                            ?  ""
                            : "胜".red;
                        var weilianping = weilianarray[4] - weilianarray[1] > 0
                            ? ""
                            : "平".red;
                        var weilianfu = weilianarray[5] - weilianarray[2] > 0
                            ? ""
                            : "负".red;

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
                            ? ""
                            : "胜".red;
                        var interwettenping = interwettenarray[4] - interwettenarray[1] > 0
                            ? ""
                            : "平".red;
                        var interwettenfu = interwettenarray[5] - interwettenarray[2] > 0
                            ? ""
                            : "负".red;

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
                            ? ""
                            : "胜".red;
                        var yishengboping = yishengboarray[4] - yishengboarray[1] > 0
                            ? ""
                            : "平".red;
                        var yishengbofu = yishengboarray[5] - yishengboarray[2] > 0
                            ? ""
                            : "负".red;

                        yishengboshuju = yishengbosheng + "," + yishengboping + "," + yishengbofu;
                    } else {
                        //数据缺失
                        //continue;
                        yishengboshuju ="数据缺失";
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
                                    sheetshuju += "数据相同(" + array1[x] + ")".yellow;
                                    break;
                                }else if( x == 2){
                                    if(sheet1flag){
                                        sheetshuju += ("全部取整数，如果不是最大，要考虑，否则不压胜(" + array1[x] + ")").yellow;
                                    }
                                    if(sheet2flag){
                                        sheetshuju +=  ("全部取整数，如果不是最大，要考虑，否则不压平(" + array1[x] + ")").yellow;
                                    }
                                    if(sheet3flag){
                                        sheetshuju +=  ("全部取整数，如果不是最大，要考虑，否则不压负(" + array1[x] + ")").yellow;
                                    }
                                    break;
                                }
                                 
                            }

                            if (element == sheet1) {
                                if(sheet1flag){
                                    sheetshuju += ("压胜(" + element + "),").green;
                                    sheet1flag = false;
                                    continue;
                                }
                                

                            }
                            if (element == sheet2) {
                                if(sheet2flag){
                                sheetshuju += ("压平(" + element + "),").green;
                                sheet2flag = false;
                                continue;
                                }
                            }
                            if (element == sheet3) {
                                if(sheet3flag){
                                sheetshuju += ("压负(" + element + "),").green;
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
                    //获取人气数据
                    var renqishuju = "";
                    //获取交易人气
                    var jiaoyishuju = "";

                    var yingli = element.get("yingli");
                    if (yingli) {
                        var yingliarray = yingli.split(";");

                        var yinglisheng = yingliarray[0].replace(new RegExp(',', "g"), "") > 0
                            ? ("胜"+yingliarray[0]).green
                            : ("亏胜"+yingliarray[0]).red;
                        var yingliping = yingliarray[1].replace(new RegExp(',', "g"), "") > 0
                            ? ("平"+yingliarray[1]).green
                            : ("亏平"+yingliarray[1]).red;
                        var yinglifu = yingliarray[2].replace(new RegExp(',', "g"), "") > 0
                            ? ("负"+yingliarray[2]).green
                            : ("亏负"+yingliarray[2]).red;
                        yinglishuju = yinglisheng + "," + yingliping + "," + yinglifu;

                        var renqiarray = [yingliarray[3], yingliarray[4], yingliarray[5]];

                        renqiarray.sort(function (a, b) {
                            return b - a;
                        });

                        for (let renqi = 0; renqi < renqiarray.length; renqi++) {
                            const element = renqiarray[renqi];
                            if(element == yingliarray[3]){
                                renqishuju += ("("+yingliarray[3]+"%)压胜,").blue;
                            }
                            if(element == yingliarray[4]){
                                renqishuju += ("("+yingliarray[4]+"%)压平,").red;
                            }
                            if(element == yingliarray[5]){
                                renqishuju += ("("+yingliarray[5]+"%)压负,").green;
                            }
                        }

                        var jiaoyiarray = [yingliarray[6], yingliarray[7], yingliarray[8]];

                        jiaoyiarray.sort(function (a, b) {
                            return b - a;
                        });

                        for (let jiaoyi = 0; jiaoyi < jiaoyiarray.length; jiaoyi++) {
                            const element = jiaoyiarray[jiaoyi];
                            if(element == yingliarray[6]){
                                jiaoyishuju += ("("+yingliarray[6]+"%)压胜,").blue;
                            }
                            if(element == yingliarray[7]){
                                jiaoyishuju += ("("+yingliarray[7]+"%)压平,").red;
                            }
                            if(element == yingliarray[8]){
                                jiaoyishuju += ("("+yingliarray[8]+"%)压负,").green;
                            }
                        }
                        
                        
                        
                        
                    } else {
                        //数据缺失
                        continue;
                    }
                    console.log("******************************************************");
                    console.log("开赛编号:\t" + serial_no + "---开赛时间:\t" + match_time);
                    console.log("参考赔率1数据:\t" + weilianshuju + "----" + interwettenshuju)
                    console.log("参考赔率2数据:\t" + yishengboshuju);
                    console.log("庄家输赢数据:\t" + yinglishuju);
                    console.log("最重要的数据:\t" + sheetshuju);
                    console.log("竞彩交易数据:\t" + renqishuju);
                    console.log("竞彩人气数据:\t" + jiaoyishuju);

                }

                response.success("OK");
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    });