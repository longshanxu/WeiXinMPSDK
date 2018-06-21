/**
 * @description 增加知识点
 * @author liangwei.xia
 * @since 2018-1-11
 */
Parse.Cloud.define("addKnowLedge",(request,response)=>{
    var knowledge_name = request.params.knowledge_name; //获取课程案例id
    var knowledge_point = request.params.knowledge_point; //获取课程案例id
    var knowledge_content = request.params.knowledge_content; //获取课程案例id
    var knowledge_keyword = request.params.knowledge_keyword; //获取课程案例id
    var knowledge_code = request.params.knowledge_code; //获取课程案例id
    var knowledge_chapter = request.params.knowledge_chapter; //获取课程案例id
    var knowledge_number = request.params.knowledge_number; //获取课程案例id
    var knowledge_school_id = request.params.knowledge_school_id; //获取课程案例id
    var KnowledgeTemplate    =     Parse.Object.extend("KnowledgeTemplate");          
    var know = new  KnowledgeTemplate();
    know.set("knowledge_name",knowledge_name);
    know.set("knowledge_point",knowledge_point);
    know.set("knowledge_content",knowledge_content);
    know.set("knowledge_keyword",knowledge_keyword);
    know.set("knowledge_code",knowledge_code);
    know.set("knowledge_chapter",knowledge_chapter);
    know.set("knowledge_number",knowledge_number);
    know.set("knowledge_school_id","ydhojXDX4I");
    know.save().then(()=>{
            response.success({"code":"200"})    ;
    }).catch((e)=>{
            response.error(e);
    })
})