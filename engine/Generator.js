const $ = new Env("珍宝签到生成引擎");

!(async ()=>{
    try{
        const config = loadConfig();
        const apiInfo = parseApi(config);
        const template = await loadTemplate(config);
        const scriptContent = buildScript(template, config, apiInfo);
        await writeScript(config, scriptContent);
        $.msg("生成成功", config.taskName);
    }catch(e){$.logErr(e)}
    finally{$.done();}
})();

// BoxJS 配置读取
function loadConfig(){
    return {
        taskName: $.getdata("@zhen.task.name"),
        cron: $.getdata("@zhen.task.cron"),
        url: $.getdata("@zhen.task.url"),
        method: $.getdata("@zhen.task.method"),
        headers: $.getdata("@zhen.task.headers"),
        body: $.getdata("@zhen.task.body"),
        template: $.getdata("@zhen.task.template"),
        platform: $.getdata("@zhen.task.platform")
    };
}

function parseApi(config){
    return {url:config.url, method:config.method, headers:config.headers, body:config.body};
}

async function loadTemplate(config){
    // 模板远程或本地读取
    let url = config.template === "单接口签到"?"./templates/single_checkin.js":"./templates/workflow_checkin.js";
    return await fetchTemplate(url);
}

function fetchTemplate(url){ return new Promise(resolve => {$httpClient.get(url,(err,rsp,data)=>resolve(data))}); }

function buildScript(template,config,api){
    template=template.replace("{{TASK_NAME}}",config.taskName)
                     .replace("{{API_URL}}",api.url)
                     .replace("{{METHOD}}",api.method)
                     .replace("{{HEADERS}}",api.headers)
                     .replace("{{BODY}}",api.body);
    return template;
}

async function writeScript(config,content){
    const filePath = `../scripts/${config.taskName}.js`;
    let encoder = new TextEncoder();
    $iCloud.writeFile(encoder.encode(content), filePath);
}
