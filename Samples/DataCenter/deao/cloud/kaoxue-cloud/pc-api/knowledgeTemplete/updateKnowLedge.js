
/**
 * @description 修改知识点
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("updateKnowLedge",(request,response)=>{
        var knowid = request.params.knowid;
        var knowledgelist =  request.params.knowledge;
        var knowledge =JSON.Parse(knowledgelist);
        var knowQuery = new parse.Query("KnowledgeTemplate");
        knowQuery.get(knowid,{useMasterKey:true}).then((know)=>{
            know.set("knowledge_name",knowledge.knowledge_name);
            know.set("knowledge_point",knowledge.knowledge_point);
            know.set("knowledge_content",knowledge.knowledge_content);
            know.set("knowledge_keyword",knowledge.knowledge_keyword);
            know.set("knowledge_code",knowledge.knowledge_code);
            know.set("knowledge_chapter",knowledge.knowledge_chapter);
            know.set("knowledge_number",knowledge.knowledge_number);  
            know.set("knowledge_school_id","ydhojXDX4I"); 
            know.save().then(()=>{
                response.success({"code":"200"});
            }).catch((e)=>{
                    response.error(e);
            })
        }).catch((e)=>{
            response.error(e);
            
        })
})