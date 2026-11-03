type Query={sql:string,params:unknown[]};
export function remoteD1(url:string,secret:string){
 if(!/^https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev\/?$/i.test(url))throw Error('Endereço da conexão D1 inválido.');
 async function send(method:string,statements:Query[]){const response=await fetch(url.replace(/\/$/,'')+'/query',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+secret},body:JSON.stringify({method,statements}),signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Falha de conexão com o banco app-medico.');return (await response.json() as {result:unknown}).result}
 function prepare(sql:string,params:unknown[]=[]){return {sql,params,bind(...values:unknown[]){return prepare(sql,values)},async all(){return send('all',[{sql,params}])},async raw(){return send('raw',[{sql,params}])},async run(){return send('run',[{sql,params}])},async first(column?:string){const result=await send('all',[{sql,params}]) as {results:Record<string,unknown>[]};const row=result.results[0]??null;return column?(row?.[column]??null):row}}}
 return {prepare,batch(statements:Query[]){return send('batch',statements.map(s=>({sql:s.sql,params:s.params})))}};
}
