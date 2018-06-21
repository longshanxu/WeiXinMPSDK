/**
 * @description 获取单个视频测试接口
 * @author yang.chen
 * @since 2017-01-22
 */

Parse.Cloud.define("getVideoItem", (request, response) => {
    console.log("进入获取单个视频测试接口");

    let FileUpload = Parse.Object.extend("fileupload");
    let CourseCase = Parse.Object.extend("CourseCase");

    let fileUploadQuery = new Parse.Query(FileUpload);
    let courseCaseQuery = new Parse.Query(CourseCase);

    let videoUrl = undefined;

    let relatedCourseCase = [];

    let courseCaseName = undefined;
    let courseCaseType = undefined;
    let subCourseCase = {};

    fileUploadQuery.get("pzW7eyAMc0").then((res) => {

        videoUrl = res.get("file")._url;
    
        relatedCourseCase = res.get("related_coursecase");

        return courseCaseQuery.get(relatedCourseCase[0]);

    }).then((result) => {

        courseCaseName = result.get("coursecase_name");

        if(relatedCourseCase[1] === "practice"){
            courseCaseType = "practice";
            let practiceList = result.get("coursecase_practice");
            practiceList.map((item, index) => {
                if(item.id == relatedCourseCase[2]){
                    subCourseCase = item;
                }
            })
        } else if(relatedCourseCase[1] === "theory"){
            courseCaseType = "theory";
            let theoryList = result.get("coursecase_theory");
            theoryList.map((item, index) => {
                if(item.id == relatedCourseCase[2]){
                    subCourseCase = item;
                }
            })
        }

        let videoItemInfo = {
            url: videoUrl,
            courseCaseName: courseCaseName,
            courseCaseId: relatedCourseCase[0],
            courseCaseType: courseCaseType,
            subCourseCase: subCourseCase,
            subCourseCaseId: relatedCourseCase[2]
        };

        // console.log(videoItemInfo);
        response.success(videoItemInfo);
    }).catch((e) => {
        console.log(e);
        response.error(e);
    })
});