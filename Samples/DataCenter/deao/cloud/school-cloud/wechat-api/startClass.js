/**
 * 老师点击签到开课
 */
var moment = require("moment");
moment.locale("zh-cn");
Parse
    .Cloud
    .define("startClass", (request, response) => {
        const start_objectId = request.params.objectid; //课的objectId
        const schoolobjectid = request.params.schoolobjectid;

        const Calendar = Parse
            .Object
            .extend("Calendar");
        const calendarQuery = new Parse.Query(Calendar);
        calendarQuery
            .get(start_objectId, {useMasterKey: true})
            .then((object) => {

                const time = moment().local(true);

                const section_time = object.get("cal_section_time");

                const openCourse = timeFn(section_time);

                //openCourse=true 当前时间符合开课条件
                if (openCourse) {

                    const open_course = object.get("cal_open_course");
                    //如果这节课没有开课时间，即可开课
                    if (open_course == undefined) {
                        object.set("cal_open_course", time.clone().toDate());
                        object.save(null, {useMasterKey: true});

                        response.success({
                            "code": "200",
                            "event": "200"
                        }); //开课正常

                    } else {
                        response.success({"code": "200", "event": "202"}); //重复开课
                    }

                } else {
                    response.success({"code": "200", "event": "201"}); //不能开课
                }

            })
            .catch((error) => {
                reponse.error(error);
            });
    });

function timeFn(time) {
    var time = time.split("--");
    var start = time[0].split(":");
    var startSum = start[0] * 3600 + start[1] * 60 + start[2] * 1;
    var end = time[1].split(":");
    var endSum = end[0] * 3600 + end[1] * 60 + end[2] * 1;
    var now = moment(new Date()).format("HH:mm:ss");
    var nowTime = now.split(":");
    var nowSum = nowTime[0] * 3600 + nowTime[1] * 60 + nowTime[2] * 1;
    if (startSum - nowSum < 600 && endSum - nowSum > 0) {
        return true;
    } else {
        return false;
    }
}