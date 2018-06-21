/**
 * @description 视频保存测试接口
 * @author yang.chen
 * @since 2017-01-11
 */

function getTypeAndBase(url) {
    let data = url.split(";")[0];
    let base = url.split(";")[1];
    let dataParamter = data.split(":")[1];
    let baseParamter = base.split(",")[1];

    let obj = {
        "data": dataParamter,
        "base64": baseParamter
    };

    return obj;
}

Parse.Cloud.define("setFileByUpload", (request, response) => {
    console.log("进入setFileByUpload接口测试");
    // console.log(request);
    // console.log(request.params);

    let responseGather = [];

    let list = JSON.parse(request.params.list); 

    let coursecase = JSON.parse(request.params.coursecase);

    let FileUpload = Parse.Object.extend('fileupload');
    
    list.map((item, index) => {

        let fileUploadItem = new FileUpload();
        var base64 = getTypeAndBase(item.url).base64;
        var type = getTypeAndBase(item.url).data;
        var file = new Parse.File(item.name, {base64: base64}, type);

        fileUploadItem.set("file", file);
        fileUploadItem.set("uid", item.uid);
        fileUploadItem.set("related_coursecase", coursecase);
        fileUploadItem.save(null).then((res) => {
            if(res){
                responseGather.push(res);

                if(responseGather.length === list.length){
                    console.log("列表文件上传完成")
                    response.success({status: "success"});
                } else {
                    console.log("列表文件上传中");
                }
            } else {
                console.log("文件上传失败");
                response.error({status: "文件上传失败"});
            }
            

        }).then().catch((e) => {
            console.log(e);
            response.error(e)
        });
    })
});