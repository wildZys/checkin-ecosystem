const $ = new Env("珍宝多步骤流程引擎");

!(async ()=>{
    try{
        const flow = $.getdata("@zhen.flow")?JSON.parse($.getdata("@zhen.flow")):null;
        if(!flow) return $.msg("未配置任务链");
        const accounts = $.getdata("@zhen.ck").split("&");
        for(let account of accounts){
            const previousSteps = [];
            for(let step of flow.steps){
                step.body = resolveDependencies(step, previousSteps);
                const resp = await httpRequest(step);
                const result = parseResponse(resp);
                previousSteps.push(result);
                logStep(step.name,result);
                if(!result.success) break;
            }
        }
        $.msg("任务链执行完成");
    }catch(e){$.logErr(e)}
    finally{$.done();}
})();

function resolveDependencies(step,prev){
    let body = JSON.stringify(step.body);
    const matches = body.match(/\{\{steps\.(\d+)\.(\w+)\}\}/g)||[];
    matches.forEach(m=>{
        const [_,idx,key] = m.match(/steps\.(\d+)\.(\w+)/);
        if(prev[idx]) body = body.replace(m,prev[idx].data[key]);
    });
    return JSON.parse(body);
}

function httpRequest(step){ return new Promise(resolve=>{$httpClient[step.method.toLowerCase()](step,(err,resp,data)=>resolve({resp,data}))}); }

function parseResponse(resp){try{return {success:true,message:"ok",data:JSON.parse(resp.data)}}catch{return {success:false,message:"解析失败",data:{}}}}

function logStep(name,result){$.log(`${name}: ${result.success? "✅": "❌"} ${result.message}`);}
