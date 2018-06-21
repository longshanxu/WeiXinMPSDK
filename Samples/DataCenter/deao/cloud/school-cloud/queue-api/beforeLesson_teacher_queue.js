//老师的课前提醒
var kueapi = require("../../../server/kue_api");
var redis = require("../../../server/queue_redis");
Parse
    .Cloud
    .define('beforeLessonTeacher', (request, response) => {
        const school_id = request.params.schoolid; //学校id
        //1. 查询绑定表，把绑定信息查询出来，找出所有老师的openid
        const bind_query = new Parse.Query("Bindings");
        bind_query.equalTo("bind_school_id",school_id);
        bind_query.equalTo("bind_type","老师");
        var bind_teacher_info = {};
        var queue_array = [];

        const calendar_query = new Parse.Query("Calendar");
        calendar_query.greaterThanOrEqualTo('cal_begin_course',new Date());
        calendar_query.equalTo("cal_school_id", school_id);
        calendar_query.include('cal_room_id');
        /**
         * 因为一个学校的老师工号是唯一的，所以用工号作为key
         * bind_teacher_info 的数据格式--json
         * bind_number:bind_openid
         */
        bind_query.find({useMasterKey:true}).then((binds)=>{
            
            binds.map((v,k)=>{           
                bind_teacher_info[v.get("bind_number")] = v.get("bind_open_id");
            });

            return calendar_query.find({useMasterKey:true});
        }).then((calendars)=>{
            console.log(calendars.length);
            calendars.map((v,k)=>{
                var teachers = [];//把calendar里面的教师遍历出来，根据number找出openid
                var teachers_name = [];//老师名称
                var tea = v.get('cal_teacher');
                console.log(tea);
                tea.map((v,k)=>{
                    teachers.push(bind_teacher_info[v.number]);
                    teachers_name.push(v.name);
                })
                //queue提醒的时间，比上课时间提前十分钟
                var course_begin_time = v.get('cal_begin_course');
                var begin_time = new Date (course_begin_time.valueOf() - (10*60*1000));
                let queue = {
                    'objectId':v.id,
                    'courseName': v.get('cal_title'),
                    'courseContent':v.get('cal_content'),
                    'teachers': teachers,
                    'teachersName':teachers_name,
                    'classroom': v
                        .get('cal_room_id')
                        .get('cr_name'),
                    'courseTime':v.get('cal_begin_course').toLocaleString(),
                    'beginTime': begin_time.toLocaleString(),
                    'title': '敬爱的'+teachers_name.toString()+'老师，您有一节课马上就要开始了！'
                };

                queue_array.push(queue);
            });

            return calendar_query.find({useMasterKey:true});
            
        }).then(()=>{
            queue_array.map((v,k)=>{
                console.log(v);

                kueapi.delayReQueue('beforeLesson_teacher',new Date(v.beginTime),v,(jobId)=>{
                    redis.setCode(v.objectId+':beforeLesson_teacher',jobId);
                });
            });
            response.success(queue_array);
        }).catch((e)=>{
            response.error(e);
        });;

    });