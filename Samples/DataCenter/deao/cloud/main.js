//男女比例分析图
require('./school-cloud/chart-api/genderDistribution_data');

//学生地域分布图
require('./school-cloud/chart-api/arealDistribution_data');

//开课时间分析图
require('./school-cloud/chart-api/startTimeOfCalendar_data');

//教师好评率图分析
require('./school-cloud/chart-api/favorableRateOfTeacher_data');

//教师课时图
require('./school-cloud/chart-api/hoursOfTeacher_data');

//学院课时图
require('./school-cloud/chart-api/hoursOfFaculty_data');

//学生评估率
require('./school-cloud/chart-api/assessRateOfStudent_data');

//教师岗位分布图
require('./school-cloud/chart-api/teachersStation_data');

//教师学位分布
require('./school-cloud/chart-api/teachersDegree_data');
require('./school-cloud/chart-api/teacherEducation_data');

//教师职位分布图
require('./school-cloud/chart-api/teachersPosition_data');

//教师签到率
require('./school-cloud/chart-api/signsRateOfTeacher_data');

//教室使用时长
require('./school-cloud/chart-api/classroomOccupyHours_data');

//教师课程完成率
require('./school-cloud/chart-api/calendarCompleteRate_data');

//教师上课教室分布
require('./school-cloud/chart-api/teacherWokingClassroom_data');

//反馈数据雷达图A(教师)
require('./school-cloud/chart-api/feedbackDataOfTeacher_data');

//反馈数据雷达图B(学生)
require('./school-cloud/chart-api/feedbackDataOfStudent_data');

//教师签到率
require('./school-cloud/chart-api/signsRateOfStudent_data');

//用户请求验证码
require("./school-cloud/wechat-api/requireMessage");

//获得验证码后，注册请求
require("./school-cloud/wechat-api/register");
//用户输入完工号/学号和姓名后，验证的接口
require("./school-cloud/wechat-api/registerMessageVerify");

//公众号进入的接口请求
require("./school-cloud/wechat-api/weChartOfficialAccount");

//公众号进入的接口请求
require("./school-cloud/wechat-api/getCalendarOfWeek");

//用户签到请求
require("./school-cloud/wechat-api/signs");

//摇一摇进入如主页接口
require("./school-cloud/wechat-api/shake");

//教师签到
require("./school-cloud/wechat-api/startClass");

require("./school-cloud/wechat-api/getScheduleByWeek");
require("./school-cloud/wechat-api/getScheduleInfoByScheduleid");
require("./school-cloud/wechat-api/getStuByTeaOpenid");
require("./school-cloud/wechat-api/getStuSignsByTeaOpenid");
require("./school-cloud/wechat-api/getAllStuByTeaOpenid");
require("./school-cloud/wechat-api/getWeekBySchoolid");
require("./school-cloud/wechat-api/getStuInfoByStuid");
require("./school-cloud/wechat-api/getStuInfoAllByStuid");
require("./school-cloud/wechat-api/changeCalendarState_afterClass");
require("./school-cloud/wechat-api/changeCalendarState_inClass");
//公众号进入，获取进入用户的详细信息
require("./school-cloud/wechat-api/getUserSignedInfoByOpenid");

require("./school-cloud/wechat-api/insertRatingByTeaOpenid");
require("./school-cloud/wechat-api/insertRatingByStuOpenid");

//pad 获取教室信息
require("./school-cloud/pad-api/getRoomInfoByRoomid");
//pad 获取教室课程信息
require("./school-cloud/pad-api/getScheduleByRoomid");
//pad 获取课程的签到信息---暂时不写
require("./school-cloud/pad-api/getSignInfoByRoomid");
require("./school-cloud/pad-api/getTeachingHours");

require("./school-cloud/wechat-api/insertTeaLogByTeaOpenid");
require("./school-cloud/pc-api/getJournalsByTeacher");
require("./school-cloud/pc-api/insertCalendarByObjectId");
require("./school-cloud/pc-api/groupingByCalendarId");
require("./school-cloud/pc-api/getAllClassRoom");
require("./school-cloud/pc-api/getAllTeacher");
require("./school-cloud/pc-api/getAllStudent");
require("./school-cloud/pc-api/getAllClasses");
require("./school-cloud/pc-api/getAllTeachingBuilding");
require("./school-cloud/pc-api/getAllClassRoom");
require("./school-cloud/pc-api/getHardWare");
//在PC上的日历中拖动更新calendar
require("./school-cloud/pc-api/updateCalendarIn");
require("./school-cloud/pc-api/deleteCalendarById");
require("./school-cloud/pc-api/deleteCalendarByIdArr");
require("./school-cloud/pc-api/reGroupByCalendarId");



//提醒
require("./school-cloud/queue-api/beforeLesson_student_queue");
require("./school-cloud/queue-api/beforeLesson_teacher_queue");
require("./school-cloud/queue-api/afterLesson_student_queue");
require("./school-cloud/queue-api/afterLesson_teacher_queue");
require("./school-cloud/queue-api/sign_queue");
require("./school-cloud/queue-api/sign_queue_afterSave");


//报表
require("./school-cloud/reportform-api/getCalendarByDate");
require("./school-cloud/reportform-api/getCalendarDetailByDate");
require("./school-cloud/reportform-api/getSignsByDate");
require("./school-cloud/reportform-api/getTeacherSignByDate");

/**
 * 考学平台接口
 */
// require("./kaoxue-cloud/pc-api/examinationAdd");
require("./kaoxue-cloud/pc-api/videofileInfo/setVideoByUpload");
require("./kaoxue-cloud/pc-api/videofileInfo/getVideoItem");
require("./kaoxue-cloud/pc-api/videofileInfo/getVideoGroupInDifferentViews");
require("./kaoxue-cloud/pc-api/videofileInfo/getVideoList");
require("./kaoxue-cloud/pc-api/examination/examinationAdd");


//考试信息相关接口
require("./kaoxue-cloud/pc-api/examination/examinationAdd");
require("./kaoxue-cloud/pc-api/examination/examinationUpdate");
require("./kaoxue-cloud/pc-api/examination/examinationDelete");
require("./kaoxue-cloud/pc-api/examination/examinationQuery");

//考场相关接口
require("./kaoxue-cloud/pc-api/examinationRoomInformation/examinationRoomAdd");
require("./kaoxue-cloud/pc-api/examinationRoomInformation/examinationRoomUpdate");
require("./kaoxue-cloud/pc-api/examinationRoomInformation/examinationRoomDelete");
require("./kaoxue-cloud/pc-api/examinationRoomInformation/examinationRoomQuery");

//教学信息相关接口
require("./kaoxue-cloud/pc-api/teachingInfo/teachingInfoAdd");
require("./kaoxue-cloud/pc-api/teachingInfo/teachingInfoUpdate");
require("./kaoxue-cloud/pc-api/teachingInfo/teachingInfoQuery");

//班组相关接口
require("./kaoxue-cloud/pc-api/team/teamAdd");
require("./kaoxue-cloud/pc-api/team/teamUpdate");
require("./kaoxue-cloud/pc-api/team/teamDelete");
require("./kaoxue-cloud/pc-api/team/teamQuery");

//物料相关接口
require("./kaoxue-cloud/pc-api/materiel/materielAdd");
require("./kaoxue-cloud/pc-api/materiel/materielQuery");
require("./kaoxue-cloud/pc-api/materiel/materielUpdate");

//设备相关接口
require("./kaoxue-cloud/pc-api/equipment/equipmentAdd");
require("./kaoxue-cloud/pc-api/equipment/equipmentQuery");
require("./kaoxue-cloud/pc-api/equipment/equipmentUpdate");

//预约相关接口
require("./kaoxue-cloud/pc-api/otherOperat/examReserve");
require("./kaoxue-cloud/pc-api/otherOperat/reservationInfo");

//课程案例接口
require("./kaoxue-cloud/pc-api/coursecase/getAllPracticeCase");
require("./kaoxue-cloud/pc-api/coursecase/addPracticeCase");
require("./kaoxue-cloud/pc-api/coursecase/addRatingRulesByPracticeId");
require("./kaoxue-cloud/pc-api/coursecase/updatePracticeCase");
require("./kaoxue-cloud/pc-api/coursecase/addCourseCase");
require("./kaoxue-cloud/pc-api/coursecase/addTheoryCase");
require("./kaoxue-cloud/pc-api/coursecase/deleteCourseCaseById");
require("./kaoxue-cloud/pc-api/coursecase/deletePracticeCaseByCourseCaseId");
require("./kaoxue-cloud/pc-api/coursecase/deleteTheoryCaseByCourseCaseId");
require("./kaoxue-cloud/pc-api/coursecase/deleteRatingRuleByPracticeId");
require("./kaoxue-cloud/pc-api/coursecase/getAllCourseCase");
require("./kaoxue-cloud/pc-api/coursecase/getAllTheoryCase");
require("./kaoxue-cloud/pc-api/coursecase/getCourseByFaculty");
require("./kaoxue-cloud/pc-api/coursecase/getCourseCaseByCourse");
require("./kaoxue-cloud/pc-api/coursecase/updateTheoryCase");
require("./kaoxue-cloud/pc-api/coursecase/updateRatingRulesByPracticeId");

//知识点模板接口
require("./kaoxue-cloud/pc-api/knowledgeTemplete/addKnowLedge");
require("./kaoxue-cloud/pc-api/knowledgeTemplete/deleteKnowLedgeById");
require("./kaoxue-cloud/pc-api/knowledgeTemplete/updateKnowLedge");