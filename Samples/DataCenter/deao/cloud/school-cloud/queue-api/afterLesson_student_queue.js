//学生的课后提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
Parse
.Cloud
.define('afterLessonStudent', (request, response) => {
    const school_id = request.params.schoolid;//学校id
    //1. 查询绑定表，把绑定信息查询出来，找出学校所有的openid
    const bind_query = new Parse.Query("Bindings");
    bind_query.equalTo("bind_school_id",school_id);
    bind_query.equalTo("bind_type","学生");
    var bind_student_info = {};

    //查询出今天以后的所有未开课的calendar
    const calendar_query = new Parse.Query("Calendar");
    calendar_query.equalTo("cal_school_id",school_id);
    calendar_query.greaterThan('cal_begin_course',new Date());
    calendar_query.include('cal_room_id');
    var all_calendar_array = [];

    var queue_array = [];//队列信息数组
    
    bind_query.find({useMasterKey:true}).then((binds)=>{
        binds.map((v,k)=>{           
            bind_student_info[v.get("bind_number")] = v.get("bind_open_id");
        });
        return calendar_query.find({useMasterKey:true});
    }).then((calendars)=>{
        all_calendar_array = calendars;

        all_calendar_array.map((v,k)=>{
            var stu = [];//放本节课所有学生的openid和姓名
            var students = v.get('cal_students');//每节课中的学生
            students.map((v,k)=>{
                if(bind_student_info[v.number]!==undefined){
                    stu.push(bind_student_info[v.number]+'+'+v.name);
                } 
            });
            var tea = [];//放本节课的上课教师
            var teachers = v.get('cal_teacher');
            teachers.map((v,k)=>{
                tea.push(v.name);
            });  

            var begin_time = new Date (v.get('cal_end_course').valueOf() + (5*60*1000));

            let queue = {
                'objectId':v.id,
                'courseName':v.get('cal_title'),
                'courseContent':v.get('cal_content'),
                'teachers':tea.toString(),
                'classroom':v.get('cal_room_id').get('cr_name'),
                'courseTime':v.get('cal_end_course').toLocaleString(),
                'beginTime':begin_time.toLocaleString(),
                'students':stu,
                'title':'亲爱的同学，本次课程已经结束！'
            };
            queue_array.push(queue);
        });

        return calendar_query.find({useMasterKey:true});

    }).then(()=>{
        queue_array.map((v,k)=>{

            kueapi.delayReQueue('afterLesson_student',new Date(v.beginTime),v,(jobId)=>{
                redis.setCode(v.objectId+':afterLesson_student',jobId);
            });
        });       

        response.success(queue_array);
    }).catch((e)=>{
        response.error(e);
    });

});