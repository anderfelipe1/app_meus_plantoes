const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
function sameSecret(a,b){if(typeof b!=='string'||a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
export default {async fetch(request,env){
 if(!env.BRIDGE_SECRET)return json({error:'Connection not configured'},503);
 if(request.method!=='POST'||new URL(request.url).pathname!=='/query')return json({error:'Not found'},404);
 const supplied=request.headers.get('Authorization')??'';if(!sameSecret(supplied,'Bearer '+env.BRIDGE_SECRET))return json({error:'Unauthorized'},401);
 try{const body=await request.text();if(body.length>200000)return json({error:'Request too large'},413);const {method,statements}=JSON.parse(body);if(!['all','raw','run','batch'].includes(method)||!Array.isArray(statements)||!statements.length||statements.length>50)return json({error:'Invalid request'},400);
 const prepared=statements.map(q=>{if(typeof q.sql!=='string'||!Array.isArray(q.params))throw Error('Invalid statement');return env.DB.prepare(q.sql).bind(...q.params)});
 const result=method==='batch'?await env.DB.batch(prepared):await prepared[0][method]();return json({result});
 }catch{return json({error:'Database operation failed'},400)}
}};
