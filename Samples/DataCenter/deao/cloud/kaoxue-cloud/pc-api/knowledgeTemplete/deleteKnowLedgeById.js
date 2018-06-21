/**
 * @description 删除知识点
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("deleteKnowLedgeById",(request,response)=>{

        var knowid = request.params.knowid;
        var knowQuery= new Parse.Query("KnowledgeTemplate");
        knowQuery.get(knowid,{useMasterKey:true}).then((know)=>{
                        know.destroy().then(()=>{
                                response.success({"code":"200"});
                        }).catch((e)=>{
                                response.error(e);
                        })
        }).catch((e)=>{
                response.error(e);    
        })

})