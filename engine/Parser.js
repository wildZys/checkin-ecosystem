const $ = new Env("珍宝抓包解析引擎");

!(async ()=>{
    try{
        const packet = getPacket();
        if(!isCheckinRequest(packet.url)) return $.msg("非签到接口");
        const parsed = extractBasic(packet);
        parsed.cookie = extractCookie(parsed.headers);
        const templateVars = mapToTemplate(parsed);
        $.setdata(JSON.stringify(templateVars),"@zhen.parser.output");
        $.msg("解析完成","可直接生成模板变量");
    }catch(e){$.logErr(e)}
    finally{$.done();}
})();

function getPacket(){
    return {$request:$request, url:$request.url, method:$request.method, headers:$request.headers, body:$request.body};
}
function isCheckinRequest(url){return ["sign","checkin","task","reward"].some(k=>url.includes(k));}
function extractBasic(packet){return {url:packet.url, method:packet.method, headers:packet.headers, body:packet.body};}
function extractCookie(headers){return headers.Cookie||headers.cookie||"";}
function mapToTemplate(parsed){return {"{{API_URL}}":parsed.url,"{{METHOD}}":parsed.method,"{{HEADERS}}":JSON.stringify(parsed.headers),"{{BODY}}":parsed.body};}
