var Decimal = require("decimal.js");
var colors = require('colors');

Parse
    .Cloud
    .define("cpu2", (request, response) => {
        var GameScore = Parse
            .Object
            .extend("Result2");
        var query = new Parse.Query(GameScore);
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var datetemp = year + "-" + month + "-" + day;
        if (month < 10) {
            datetemp = year + "-0" + month + "-" + day;
        }
        datetemp = "2019-01-21";

        query.equalTo("today", datetemp);
        query.ascending("serial_no");
        query.limit(500);
        query.find({
            success: function (results) {
                var returnarray = [];
                for (let index = 0; index < results.length; index++) {
                    var resarray = {};
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
                    // if (d1 < d2) {     continue; } 获取威廉数据
                    var weilian = element.get("weilian");

                    //获取inter数据
                    var interwetten = element.get("interwetten");

                    var guanfang365 = element.get("guanfang");
                    var pankou = element.get("pankou");
                    var bet365 = element.get("bet365");
                    //获取威廉和inter的数据对比
                    var sheetshuju = "";
                    if (weilian && interwetten) {
                        var weilianarray = weilian.split("-");
                        var interwettenarray = interwetten.split("-");

                        var sheet1 = new Decimal(weilianarray[3]).sub(new Decimal(interwettenarray[3])).toNumber();
                        var sheet2 = new Decimal(weilianarray[4]).sub(new Decimal(interwettenarray[4])).toNumber();
                        var sheet3 = new Decimal(weilianarray[5]).sub(new Decimal(interwettenarray[5])).toNumber();
                        var a1 = Math.abs(sheet1);
                        var a2 = Math.abs(sheet2);
                        var a3 = Math.abs(sheet3);
                        var jsonkey = {
                            sheet1: a1,
                            sheet2: a2,
                            sheet3: a3
                        };
                        var array1 = [jsonkey.sheet1, jsonkey.sheet2, jsonkey.sheet3];

                        array1.sort(function (a, b) {
                            return a - b;
                        });

                        for (let x = 0; x < array1.length; x++) {

                            // if (array1[x] == jsonkey.sheet1 &&  parseFloat(sheet1) >= parseFloat(0) ) {
                            //     sheetshuju += "胜";
                            //     break;
                            // }
                            // if (array1[x] == jsonkey.sheet2 &&  parseFloat(sheet2) >= parseFloat(0)  ) {
                            //     sheetshuju += "平";
                            //     break;
                            // }
                            // if (array1[x] == jsonkey.sheet3 &&  parseFloat(sheet3) >= parseFloat(0)  ) {
                            //     sheetshuju += "负";
                            //     break;
                            // }
                            
                            
                        }

                        sheetshuju +="\t("+ (sheet1 >= 0.2 ? (sheet1+"").red : sheet1) +","+(sheet2 >= 0.2 ? (sheet2+"").red : sheet2)+","+(sheet3 >= 0.2 ? (sheet3+"").red : sheet3)+")";

                    } 
                    //bet365和inter
                    var sheetshuju2 = "";
                    if (bet365 && weilian) {
                        var weilianarray = weilian.split("-");
                        var interwettenarray = bet365.split("-");

                        var sheet1 = new Decimal(weilianarray[3]).sub(new Decimal(interwettenarray[8])).toNumber();
                        var sheet2 = new Decimal(weilianarray[4]).sub(new Decimal(interwettenarray[9])).toNumber();
                        var sheet3 = new Decimal(weilianarray[5]).sub(new Decimal(interwettenarray[10])).toNumber();
                        var a1 = Math.abs(sheet1);
                        var a2 = Math.abs(sheet2);
                        var a3 = Math.abs(sheet3);
                        var jsonkey = {
                            sheet1: a1,
                            sheet2: a2,
                            sheet3: a3
                        };
                        var array1 = [jsonkey.sheet1, jsonkey.sheet2, jsonkey.sheet3];

                        array1.sort(function (a, b) {
                            return a - b;
                        });

                        for (let x = 0; x < array1.length; x++) {

                            // if (array1[x] == jsonkey.sheet1 &&  parseFloat(sheet1) >= parseFloat(0)) {
                            //     sheetshuju2 += "胜";
                            //     break;
                            // }
                            // if (array1[x] == jsonkey.sheet2 &&  parseFloat(sheet2) >= parseFloat(0) ) {
                            //     sheetshuju2 += "平";
                            //     break;
                            // }
                            // if (array1[x] == jsonkey.sheet3 &&  parseFloat(sheet3) >= parseFloat(0)) {
                            //     sheetshuju2 += "负";
                            //     break;
                            // }

                        }

                        sheetshuju2 += "\t("+ (sheet1 >= 0.2 ? (sheet1+"").red : sheet1) +","+(sheet2 >= 0.2 ? (sheet2+"").red : sheet2)+","+(sheet3 >= 0.2 ? (sheet3+"").red : sheet3)+")";

                    } 

                    //竞彩数据
                    var sheetshuju3 = "";
                    if (guanfang365 && weilian) {
                        var weilianarray = weilian.split("-");
                        var interwettenarray = guanfang365.split("-");

                        var sheet1 = new Decimal(weilianarray[3]).sub(new Decimal(interwettenarray[8])).toNumber();
                        var sheet2 = new Decimal(weilianarray[4]).sub(new Decimal(interwettenarray[9])).toNumber();
                        var sheet3 = new Decimal(weilianarray[5]).sub(new Decimal(interwettenarray[10])).toNumber();
                        var a1 = Math.abs(sheet1);
                        var a2 = Math.abs(sheet2);
                        var a3 = Math.abs(sheet3);
                        var jsonkey = {
                            sheet1: a1,
                            sheet2: a2,
                            sheet3: a3
                        };
                        var array1 = [jsonkey.sheet1, jsonkey.sheet2, jsonkey.sheet3];

                        array1.sort(function (a, b) {
                            return a - b;
                        });

                        for (let x = 0; x < array1.length; x++) {

                            if (array1[x] == jsonkey.sheet1 &&  parseFloat(sheet1) >= parseFloat(0)) {
                                sheetshuju3 += "胜";
                               
                            }
                            if (array1[x] == jsonkey.sheet2 &&  parseFloat(sheet2) >= parseFloat(0) ) {
                                sheetshuju3 += "平";
                                
                            }
                            if (array1[x] == jsonkey.sheet3 &&  parseFloat(sheet3) >= parseFloat(0) ) {
                                sheetshuju3 += "负";
                                
                            }
                               
                            if(x==1){

                                break;
                            }
                      
                        }

                        sheetshuju3 += "\t("+ (sheet1 >= 0.2 ? (sheet1+"").red : sheet1) +","+(sheet2 >= 0.2 ? (sheet2+"").red : sheet2)+","+(sheet3 >= 0.2 ? (sheet3+"").red : sheet3)+")";

                    } 
                    //获取交易比例数据
                    var yinglishuju = "";
                    //获取交易让球比例数据
                    var yinglishuju1 = "";
                    //庄家盈亏比例
                    var zhuangjiashuju = "";
                    //庄家让球盈亏比例
                    var zhuangjiashuju1 = "";

                    var yingli = element.get("yingli");
                    if (yingli) {
                        var yingliarray = yingli.split(";");

                        yinglishuju = "压胜：" + (parseFloat(yingliarray[0]) > parseFloat("50%")
                            ? (yingliarray[0]).green
                            : yingliarray[0]) + "\t压平：" + (parseFloat(yingliarray[1]) > parseFloat("50%")
                            ? (yingliarray[1]).green
                            : yingliarray[1]) + "\t压负：" + (parseFloat(yingliarray[2]) > parseFloat("50%")
                            ? (yingliarray[2]).green
                            : yingliarray[2]);

                        yinglishuju1 = "压胜：" + (parseFloat(yingliarray[3]) > parseFloat("50%")
                            ? (yingliarray[3]).green
                            : yingliarray[3]) + "\t压平：" + (parseFloat(yingliarray[4]) > parseFloat("50%")
                            ? (yingliarray[4]).green
                            : yingliarray[4]) + "\t压负：" + (parseFloat(yingliarray[5]) > parseFloat("50%")
                            ? (yingliarray[5]).green
                            : yingliarray[5]);

                        zhuangjiashuju = "压胜：" + (parseFloat(yingliarray[6]) > parseFloat("50%")
                            ? (yingliarray[6]).green
                            : yingliarray[6]) + "\t压平：" + (parseFloat(yingliarray[7]) > parseFloat("50%")
                            ? (yingliarray[7]).green
                            : yingliarray[7]) + "\t压负：" + (parseFloat(yingliarray[8]) > parseFloat("50%")
                            ? (yingliarray[8]).green
                            : yingliarray[8]);

                        zhuangjiashuju1 = "压胜：" + (parseFloat(yingliarray[9]) > parseFloat("50%")
                            ? (yingliarray[9]).green
                            : yingliarray[9]) + "\t压平：" + (parseFloat(yingliarray[10]) > parseFloat("50%")
                            ? (yingliarray[10]).green
                            : yingliarray[10]) + "\t压负：" + (parseFloat(yingliarray[11]) > parseFloat("50%")
                            ? (yingliarray[11]).green
                            : yingliarray[11]);

                    } else {
                        //数据缺失
                        continue;
                    }



                    var guanfangkaili = "";
                    if (guanfang365 && bet365) {

                        var weilianarray = guanfang365.split("-");
                        var interwettenarray = bet365.split("-");

                        guanfangkaili = "胜平负 (" + weilianarray[3] + "," + weilianarray[4] + "," + weilianarray[5] + ")-赔率：" + weilianarray[6] + ",(" + interwettenarray[3] + "," + interwettenarray[4] + "," + interwettenarray[5] + ")-赔率:" + interwettenarray[7];

                    }

                    var kailisheetshuju = "";
                    if (guanfang365 && bet365) {
                        
                        var weilianarray = guanfang365.split("-");
                        var betarray = bet365.split("-");
                        var str= weilianarray[6].replace("%","");
                        str= str/100;
                        var betstr= betarray[7].replace("%","");
                        betstr= betstr/100;
                        
                        if (str > weilianarray[3]) {
                            kailisheetshuju += "胜";
                        
                        }
                        if (str > weilianarray[4]) {
                            kailisheetshuju += "平";
                    
                        }
                        if (str > weilianarray[5]) {
                            kailisheetshuju += "负";
                        
                        }
                        kailisheetshuju += ","
                        if (betstr > betarray[3]) {
                            kailisheetshuju += "胜";
                        
                        }
                        if (betstr > betarray[4]) {
                            kailisheetshuju += "平";
                    
                        }
                        if (betstr > betarray[5]) {
                            kailisheetshuju += "负";
                        
                        }



                    } else {
                        continue;
                    }

                    var pankoustr = "";
                    var daxiaoqiu="";
                    var yapanstr ="";
                    var yapan =""
                    var daqiupk = "";
                    var yapanpk = "";
                    if(pankou){
                       // 二球半/三球_0.82_0.98_94.83%_二球半/三球_0.85_1.06_97.47%_半球_1.08_0.78_95.92%_平手/半球_0.84_1.10_98.07%
                        var pankouarray = pankou.split("_");
                        var sheet = new Decimal(pankouarray[1]).add(new Decimal(pankouarray[2])).add(new Decimal(pankouarray[5])).add(new Decimal(pankouarray[6])).toNumber();
                        pankoustr = sheet +"  球数1：".red +pankouarray[0]+"  球数2：".red+pankouarray[4] ;
                        

                        var daxiaoqiu1 = new Decimal(pankouarray[5]).sub(new Decimal(pankouarray[1]));
                        var daxiaoqiu2 = new Decimal(pankouarray[6]).sub(new Decimal(pankouarray[2]));
                        daqiupk = parseFloat(daxiaoqiu1) > parseFloat(daxiaoqiu2) ? "小球：".blue+daxiaoqiu1+","+daxiaoqiu2 :'大球：'.blue+daxiaoqiu1+","+daxiaoqiu2 ;
                        daxiaoqiu= pankouarray[1] +"-"+pankouarray[2]+"赔率：("+pankouarray[3]+")==="+pankouarray[5] +"-"+pankouarray[6]+"赔率：("+pankouarray[7]+")";
                        

                        var sheet1 = new Decimal(pankouarray[9]).add(new Decimal(pankouarray[10])).add(new Decimal(pankouarray[13])).add(new Decimal(pankouarray[14])).toNumber();
                        
                        var pankou1 = new Decimal(pankouarray[13]).sub(new Decimal(pankouarray[9]));
                        var pankou2 = new Decimal(pankouarray[14]).sub(new Decimal(pankouarray[10]));
                        yapanpk = parseFloat(pankou1) > parseFloat(pankou2) ? "负：".blue+pankou1+","+pankou2 :'胜：'.blue+pankou1+","+pankou2 ;
                      
                        yapanstr = sheet1 + "  盘口1：".red +pankouarray[8]+"  盘口2：".red+pankouarray[12] ; 
                        yapan = pankouarray[9] +"-"+pankouarray[10]+"赔率：("+pankouarray[11]+")==="+pankouarray[13] +"-"+pankouarray[14]+"赔率：("+pankouarray[15]+")";
                    }

                    console.log("******************************************************");
                    console.log("开赛编号:\t" + serial_no + "---开赛时间:\t" + match_time);
                    console.log("邪路赔率数据:\t" + sheetshuju +"\t如正数，看好。如果负数，威廉看好");
                    console.log("正路赔率数据:\t"+sheetshuju2+"\t如正数，看好。如果负数，威廉看好");
                    console.log("竞彩赔率数据:\t" + sheetshuju3+"\t如正数，看好。如果负数，威廉看好");
                    console.log("竞彩凯利数据:\t" + kailisheetshuju);
                    console.log("参考凯利数据:\t" + guanfangkaili);
                    console.log("彩民交易比例:\t" + yinglishuju);
                    console.log("庄家盈亏比例:\t".green + zhuangjiashuju);
                    console.log("彩民让球交易：\t" + yinglishuju1);
                    console.log("庄家让球盈亏:\t".green + zhuangjiashuju1);
                    console.log("球数数据:\t" +pankoustr);
                    console.log("大小球方向数据:\t".green + daxiaoqiu+"-----"+daqiupk);
                    console.log("亚盘数据:\t" + yapanstr);
                    console.log("亚盘盘口数据:\t".green +yapan+"-----"+yapanpk);
                    // resarray["title"] = "开赛编号:" + serial_no + "---开赛时间:" + match_time;
                    // resarray["data1"] = "最重要的数据1:" + sheetshuju;
                    // resarray["kaili"] = "参考凯利数据:\t" + guanfangkaili;
                    // resarray["data2"] = "最重要的数据2:" + kailisheetshuju;
                    // resarray["jiaoyi"] = "彩民交易比例: " + yinglishuju;
                    // resarray["jiaoyiyili"] = "庄家盈亏比例: " + zhuangjiashuju;
                    // resarray["rangjiaoyi"] = "彩民让球交易：" + yinglishuju1;
                    // resarray["rangjiaoyiyili"] =  "庄家让球盈亏:" + zhuangjiashuju1;
                    // returnarray.push(resarray);

                }

                response.success(returnarray);
            },
            error: function (error) {
                response.error(error);
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    });