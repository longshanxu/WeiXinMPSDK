/**
 * 这里本是采用parse server的监听操作用来监听签到表，如果有新增的签到信息，就创建一个发送签到提醒。
 * 现放弃本方法，现采用parse的afterSave方法去创建提醒
 */
// let Parse = require('parse/node');
// var kueapi = require("./kue_api");
// Parse.initialize('myAppId','myjskey','myMasterKey');
// //Parse.serverURL = `http://deao.chinacloudapp.cn/parse`;
// Parse.serverURL = `http://deao.chinacloudapp.cn/parse`;

// let query = new Parse.Query('StudentSigns');

// let subscription = query.subscribe();

// subscription.on('open', () => {
//  console.log('subscription opened');
// });

// subscription.on('create', (object) => {
//   console.log('object created');

//   //parse server 会监听签到表，然后会把新加入的签到信息，一条一条的发送到这里
//   /**
//    * 签到学生的信息，签到课程信息，教室信息，
//    */
//   const calendar_query = new Parse.Query("Calendar");
//   const classroom_query = new Parse.Query("ClassRoom");
//   var sign , calendar_id , calendar , classroom_id , classroom , schoolid;
//   var teacher_info = {};//教师信息json对象
//   var calendar_teachers = [];//calendar中的上课教师

//   sign = object;
//   console.log("sign",sign);
//   calendar_id = sign.get('ss_calendar_id');
//   classroom_id = sign.get('ss_room_id');

//   calendar_query.get(calendar_id,{useMasterKey:true}).then((object_calendar)=>{
//       calendar = object_calendar;
//       schoolid = calendar.get("cal_school_id");
//       calendar_teachers = calendar.get("cal_teacher");
//       console.log("calendar",calendar);

//       //根据课程获取到的schoolid，去查询本学校的教师
//       const teacher_query = new Parse.Query("Teacher");
//       teacher_query.equalTo("tcher_school_id",schoolid);

//       return teacher_query.find({useMasterKey:true});
//   }).then((objects)=>{

//     objects.map((v,k)=>{           
//       teacher_info[v.get("tcher_number")] = v.get("tcher_name");
//     });
//     return classroom_query.get(classroom_id,{useMasterKey:true});
//   }).then((object_room)=>{
//       classroom = object_room;
//       console.log("classroom",classroom);
//       var teachers = [];
      
//       calendar_teachers.map((v,k)=>{
//         teachers.push(teacher_info[v.number]);
//       });
//       let queue = {
//           "studentName":sign.get('ss_student_name'),
//           "studentOpenid":[sign.get('ss_student_openid')],
//           "studentNumber":sign.get('ss_student_number'),
//           "calendarName":calendar.get('cal_title'),
//           "classRoomName":classroom.get('cr_name'),
//           "signedTime":sign.get('ss_signs_time').toLocaleString(),
//           "calendarTeacher":teachers.toString(),
//           "title":'您好，在('+classroom.get('cr_name')+')教室的课程('+calendar.get('cal_title')+')完成了签到！'
//       }
//       console.log('queue:',queue);
//       kueapi.doQueue("signok",queue);

//   }).catch((e)=>{
//       response.error(e);
//   });

// });

// subscription.on('update', (object) => {
//   console.log('object updated');
// });

// subscription.on('enter', (object) => {
//   console.log('object entered');
// });

// subscription.on('leave', (object) => {
//   console.log('object left');
// });

// subscription.on('delete', (object) => {
//   console.log('object deleted');
// });

// subscription.on('close', () => {
//   console.log('subscription closed');
// });