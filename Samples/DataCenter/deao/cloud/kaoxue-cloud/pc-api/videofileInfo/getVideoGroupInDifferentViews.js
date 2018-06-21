/**
 * @description 教室不同角度获取的一组视频
 * @author yang.chen
 * @since 2017-01-23
 */

Parse.Cloud.define("getVideoGroupInDifferentViews", (request, response) => {
    console.log("进入教室不同角度获取一组视频的测试接口");
    let param = ["QzZteO58GM","practice","9"];

    let FileUpload = Parse.Object.extend("fileupload");
    let CourseCase = Parse.Object.extend("CourseCase");

    let fileUploadQuery = new Parse.Query(FileUpload);
    let courseCaseQuery = new Parse.Query(CourseCase);

    let urlGroup = [];
    let videoItem = {};

    courseCaseQuery.get(param[0]).then((res) => {
        if(param[1] === "practice"){
            let subCourseCaseList = res.get("coursecase_practice");
            let subCourseCase = {};
            subCourseCaseList.map((item, index) => {
                if(item.id == param[2]){
                    subCourseCase = item;
                }
            });

            videoItem = {
                courseCaseId: param[0],
                courseCaseName: res.get("coursecase_name"),
                courseCaseType: param[1],
                subCourseCase: subCourseCase,
            }
        } else {
            let subCourseCaseList = res.get("coursecase_theory");
            let subCourseCase = {};
            subCourseCaseList.map((item, index) => {
                if(item.id == param[2]){
                    subCourseCase = item;
                }
            });

            videoItem = {
                courseCaseId: param[0],
                courseCaseName: res.get("coursecase_name"),
                courseCaseType: param[1],
                subCourseCase: subCourseCase
            }
        }
    }).then(() => {
        fileUploadQuery.containsAll("related_coursecase", param);
        return fileUploadQuery.find();
    }).then((results) => {
        results.map((item, index) => {
            let urlItem = item.get("file")._url;
            urlGroup.push(urlItem);
        });

        console.log(urlGroup);
        videoItem.url = urlGroup
        console.log(videoItem);
        response.success(videoItem);
    }).catch((e) => {
        console.log(e);
        response.error(e);
    })

})