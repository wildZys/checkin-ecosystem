/**
 * @name {{TASK_NAME}}
 * @version 1.0
 * @author 老珍生态
 * @template 单接口签到
 * @platform 通用
 */

const $ = new Env("单接口签到");

const TASK_CONFIG = {
    api: {
        url: "{{API_URL}}",
        method: "{{METHOD}}",
        headers: {{HEADERS}},
        body: "{{BODY}}"
    },
    cron: "{{CRON}}",
    multiAccount: true
};

!(async ()=>{
    try{
        const accounts = getAccounts();
        for(let account of accounts){
            const req = buildRequest(account);
            const resp = await http(req);
            const result = parseResponse(resp.resp, resp.data);
            logStep(result);
        }
    }catch(e){$.logErr(e)}
    finally{$.done();}
})();

function getAccounts(){
    const ck = $.getdata("@zhen.ck") || "";
    return ck.split("&");
}

function buildRequest(account){
    return {
        url: TASK_CONFIG.api.url,
        method: TASK_CONFIG.api.method,
        headers: TASK_CONFIG.api.headers,
        body: TASK_CONFIG.api.body
    };
}

function parseResponse(resp, data){
    let obj;
    try{obj=JSON.parse(data)}catch{obj={msg:data||"解析失败"}}
    return {success:obj.code===0, message: obj.msg||"未知结果", data:obj};
}

function http(options){
    return new Promise(resolve=>{
        $httpClient[options.method.toLowerCase()](options,(err,resp,data)=>{
            resolve({resp,data});
        });
    });
}

function logStep(result){
    if(result.success) $.info(`✅ ${result.message}`);
    else $.error(`❌ ${result.message}`);
}
