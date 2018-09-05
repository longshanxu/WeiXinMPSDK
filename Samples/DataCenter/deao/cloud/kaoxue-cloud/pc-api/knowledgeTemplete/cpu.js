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
      datetemp = "2018-09-04";;

        query.equalTo("today", datetemp);
        query.ascending("serial_no");
        query.limit(500);
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
                    var d2 = new Date(); //取明天的日期
                    var d1 = new Date(Date.parse(yourtime));
                    // if (d1 < d2) {
                    //     continue;
                    // }
                    //获取威廉数据
                    var weilian = element.get("weilian");
                 

                    //获取inter数据
                    var interwetten = element.get("interwetten");
                 

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
                                if (array1[x] == array1[x - 1]) {
                                    sheetshuju += "数据相同(" + array1[x] + ")".yellow;
                                    break;
                                } else if (x == 2) {
                                    if (sheet1flag) {
                                        sheetshuju += ("不压胜(" + array1[x] + ")"+",全部取正整数，如果不是最大，要注意！！").yellow;
                                    }
                                    if (sheet2flag) {
                                        sheetshuju += ("不压平(" + array1[x] + ")"+",全部取正整数，如果不是最大，要注意！！").yellow;
                                    }
                                    if (sheet3flag) {
                                        sheetshuju += ("不压负(" + array1[x] + ")"+",全部取正整数，如果不是最大，要注意！！").yellow;
                                    }
                                    break;
                                }

                            }

                            if (element == sheet1) {
                                if (sheet1flag) {
                                    sheetshuju += ("压胜(" + element + "),").red;
                                    sheet1flag = false;
                                    continue;
                                }

                            }
                            if (element == sheet2) {
                                if (sheet2flag) {
                                    sheetshuju += ("压平(" + element + "),").red;
                                    sheet2flag = false;
                                    continue;
                                }
                            }
                            if (element == sheet3) {
                                if (sheet3flag) {
                                    sheetshuju += ("压负(" + element + "),").red;
                                    sheet3flag = false;
                                    continue;
                                }

                            }

                        }

                    } else {
                        continue;
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
                       
                        yinglishuju = "压胜：" + (parseFloat(yingliarray[0]) > parseFloat("50%") ? (yingliarray[0]).green : yingliarray[0])
                                         + "\t压平：" + (parseFloat(yingliarray[1]) > parseFloat("50%") ? (yingliarray[1]).green : yingliarray[1])
                                         + "\t压负：" + (parseFloat(yingliarray[2]) > parseFloat("50%") ? (yingliarray[2]).green : yingliarray[2]);

                        yinglishuju1 = "压胜：" + (parseFloat(yingliarray[3]) > parseFloat("50%") ? (yingliarray[3]).green : yingliarray[3])
                        + "\t压平：" + (parseFloat(yingliarray[4]) > parseFloat("50%") ? (yingliarray[4]).green : yingliarray[4])
                        + "\t压负：" + (parseFloat(yingliarray[5]) > parseFloat("50%") ? (yingliarray[5]).green : yingliarray[5]);

                        zhuangjiashuju = "压胜：" + (parseFloat(yingliarray[6]) > parseFloat("50%") ? (yingliarray[6]).green : yingliarray[6])
                        + "\t压平：" + (parseFloat(yingliarray[7]) > parseFloat("50%") ? (yingliarray[7]).green : yingliarray[7])
                        + "\t压负：" + (parseFloat(yingliarray[8]) > parseFloat("50%") ? (yingliarray[8]).green : yingliarray[8]);

                        zhuangjiashuju1 = "压胜：" + (parseFloat(yingliarray[9]) > parseFloat("50%") ? (yingliarray[9]).green : yingliarray[9])
                        + "\t压平：" + (parseFloat(yingliarray[10]) > parseFloat("50%") ? (yingliarray[10]).green : yingliarray[10])
                        + "\t压负：" + (parseFloat(yingliarray[11]) > parseFloat("50%") ? (yingliarray[11]).green : yingliarray[11]);

                    } else {
                        //数据缺失
                        continue;
                    }

                    var guanfang365 = element.get("guanfang");
                    var bet365 = element.get("bet365");

                    var guanfangkaili = "";
                    if (guanfang365 && bet365) {

                        var weilianarray = guanfang365.split("-");
                        var interwettenarray = bet365.split("-");


                        guanfangkaili ="胜平负 (" + weilianarray[3] + "," + weilianarray[4] + "," + weilianarray[5] + ")-赔率：" + weilianarray[6] + ",(" + interwettenarray[3] + "," + interwettenarray[4] + "," + interwettenarray[5] + ")-赔率:" + interwettenarray[7];

                    } else {
                        continue;
                    }

                    var kailisheetshuju = "";
                    if (guanfang365 && bet365) {
                        var weilianarray = guanfang365.split("-");
                        var interwettenarray = bet365.split("-");

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
                                if (array1[x] == array1[x - 1]) {
                                    kailisheetshuju += "数据相同(" + array1[x] + ")".yellow;
                                    break;
                                } else if (x == 2) {
                                    if (sheet1flag) {
                                        kailisheetshuju += ("不压胜(" + array1[x] + ")"+",全部取正整数，如果不是最大，要注意！！").yellow;
                                    }
                                    if (sheet2flag) {
                                        kailisheetshuju += ("不压平(" + array1[x] + ")"+",全部取正整数，如果不是最大，要注意！！").yellow;
                                    }
                                    if (sheet3flag) {
                                        kailisheetshuju += ("不压负(" + array1[x] + ")"+",全部取正整数，如果不是最大，要注意！！").yellow;
                                    }
                                    break;
                                }

                            }

                            if (element == sheet1) {
                                if (sheet1flag) {
                                    kailisheetshuju += ("压胜(" + element + "),").red;
                                    sheet1flag = false;
                                    continue;
                                }

                            }
                            if (element == sheet2) {
                                if (sheet2flag) {
                                    kailisheetshuju += ("压平(" + element + "),").red;
                                    sheet2flag = false;
                                    continue;
                                }
                            }
                            if (element == sheet3) {
                                if (sheet3flag) {
                                    kailisheetshuju += ("压负(" + element + "),").red;
                                    sheet3flag = false;
                                    continue;
                                }

                            }

                        }

                    } else {
                        continue;
                    }

                    console.log("******************************************************");
                    console.log("开赛编号:\t" + serial_no + "---开赛时间:\t" + match_time);
                    console.log("最重要的数据1:\t" + sheetshuju);
                    console.log("参考凯利数据:\t" + guanfangkaili);
                    console.log("最重要的数据2:\t" + kailisheetshuju);
                    console.log("彩民交易比例:\t" + yinglishuju);
                    console.log("庄家盈亏比例:\t".green + zhuangjiashuju);
                    console.log("彩民让球交易：\t" + yinglishuju1);
                    console.log("庄家让球盈亏:\t".green + zhuangjiashuju1);

                }

                response.success("OK");
            },
            error: function (error) {
                response.error(error);
                console.log("Error: " + error.code + " " + error.message);
            }
        });

    });