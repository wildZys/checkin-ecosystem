/**
 * @name {{TASK_NAME}}
 * @version 1.0
 * @author 老珍生态
 * @template 多步骤任务链
 * @platform 通用
 */

const $ = new Env("多步骤流程签到");

const TASK_CONFIG = {
    steps: [], // 通过 Generator 注入
    cron: "{{CRON}}",
    multiAccount: true
};

!(async ()=>{
    try{
        const flow = TASK_CONFIG.steps;
        const accounts = getAccounts();
        for(let account of accounts){
            const previousSteps = [];
            for(let step of flow){
                step.body = resolveDependencies(step, previousSteps);
                const resp = await httpRequest(step);
                const result = parseResponse(resp);
                previousSteps.push(result);
                logStep(step.name,result);
                if(!result.success) break;
            }
        }
    }catch(e){$.logErr(e)}
    finally{$.done();}
})();

function getAccounts(){
    const ck = $.getdata("@zhen.ck") || "";
    return ck.split("&");
}

function resolveDependencies(step, prev){
    let body = JSON.stringify(step.body||{});
    const matches = body.match(/\{\{steps\.(\d+)\.(\w+)\}\}/g)||[];
    matches.forEach(m=>{
        const [_,idx,key] = m.match(/steps\.(\d+)\.(\w+)/);
        if(prev[idx]) body = body.replace(m,prev[idx].data[key]||"");
    });
    return JSON.parse(body);
}

function httpRequest(step){
    return new Promise(resolve=>{
        $httpClient[step.method.toLowerCase()](step,(err,resp,data)=>{
            resolve({resp,data});
        });
    });
}

function parseResponse(resp){
    try{const obj=JSON.parse(resp.data||resp.body||"{}");return {success:true,message:"ok",data:obj}}catch{return {success:false,message:"解析失败",data:{}}}
}

function logStep(name,result){
    $.log(`${name}: ${result.success? "✅":"❌"} ${result.message}`);
}
