/**
 * @description 获取视频列表
 * @author yang.chen
 * @since 2017-01-24
 */

Parse.Cloud.define("getVideoList", (request, response) => {
    console.log("进入获取视频列表测试接口");
    let FileUpload = Parse.Object.extend("fileupload");
    let CourseCase = Parse.Object.extend("CourseCase");

    let fileUploadQuery = new Parse.Query(FileUpload);
    let courseCaseQuery = new Parse.Query(CourseCase);

    let videoList = [];
    let courseCaseList = [];
    
    courseCaseQuery.find().then((results) => {
        results.map((item, index) => {
            let courseCaseItem = {
                id: item.id,
                name: item.get("coursecase_name"),
                practice: item.get("coursecase_practice"),
                theory: item.get("coursecase_theory")
            };
            courseCaseList.push(courseCaseItem);
        });
        
    }).then(() => {
        return fileUploadQuery.find();
    }).then((results) => {
        results.map((item, index) => {
            let relatedCourseCase = item.get("related_coursecase");
            let urlItem = item.get("file")._url;
            let videoItem = {
                id: item.id,
                url: urlItem,
                courseCaseId: relatedCourseCase[0],
                courseCaseType: relatedCourseCase[1],
                subCourseCaseId: relatedCourseCase[2]
            };
            videoList.push(videoItem);
        });

        videoList.map((item, index) => {
            courseCaseList.map((v, k) => {
                if(item.courseCaseId == v.id){
                    item.courseCaseName = v.name;
                    item.practice = v.practice;
                    item.theory = v.theory;
                };
            });
        });

        videoList.map((item, index) => {
            if(item.courseCaseType === "practice"){
                item.practice.map((v, k) => {
                    if(item.subCourseCaseId == v.id){
                        item.subCourseCase = v;
                    }
                })
            } else if(item.courseCaseType === "theory"){
                item.theory.map((v, k) => {
                    if(item.subCourseCaseId == v.id){
                        item.subCourseCase = v;
                    }
                })
            }
        })

        videoList.map((item, index) => {
            delete item.practice;
            delete item.theory;
        })

        // console.log(videoList);
        response.success(videoList);
    }).catch((e) => {
        console.log(e);
        response.error(e);
    })

    

})