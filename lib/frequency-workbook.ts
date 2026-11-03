import template from './frequency-template.json' with {type:'json'};
const enc=new TextEncoder();
const dec=new TextDecoder();
const from64=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const crc=(bytes:Uint8Array)=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0};
function zip(files:Record<string,Uint8Array>){const pieces:Uint8Array[]=[],central:Uint8Array[]=[];let offset=0;for(const [name,data] of Object.entries(files)){const n=enc.encode(name),sum=crc(data),h=new Uint8Array(30+n.length),v=new DataView(h.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,sum,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,n.length,true);h.set(n,30);const c=new Uint8Array(46+n.length),w=new DataView(c.buffer);w.setUint32(0,0x02014b50,true);w.setUint16(4,20,true);w.setUint16(6,20,true);w.setUint16(8,0x800,true);w.setUint16(14,33,true);w.setUint32(16,sum,true);w.setUint32(20,data.length,true);w.setUint32(24,data.length,true);w.setUint16(28,n.length,true);w.setUint32(42,offset,true);c.set(n,46);pieces.push(h,data);central.push(c);offset+=h.length+data.length;}const size=central.reduce((s,b)=>s+b.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,central.length,true);v.setUint16(10,central.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);pieces.push(...central,end);const out=new Uint8Array(offset+size+22);let i=0;for(const p of pieces){out.set(p,i);i+=p.length}return out;}
export function frequencyWorkbook(month:string,days:string[]){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))throw Error('Competência inválida.');
 const unique=[...new Set(days)].sort();if(unique.some(d=>!d.startsWith(month+'-')||!/^\d{4}-\d{2}-\d{2}$/.test(d)))throw Error('Data fora da competência.');
 const files=Object.fromEntries(Object.entries(template).map(([k,v])=>[k,from64(v)]));let xml=dec.decode(files['xl/worksheets/sheet1.xml']);
 const rows=xml.match(/<row\b[^>]*\br="14"[^>]*>[\s\S]*?<\/row>/)?.[0];if(!rows)throw Error('Modelo sem linha de datas.');
 // Reuse the template row styles and preserve every other workbook part.
 const count=Math.max(16,unique.length),extra=count-16;
 const generated=Array.from({length:count},(_,i)=>{const r=14+i,day=unique[i];const serial=day?Math.round((Date.parse(day+'T00:00:00Z')-Date.UTC(1899,11,30))/86400000):null;return `<row r="${r}" ht="14.25" customHeight="1"><c r="A${r}" s="28">${serial===null?'':`<v>${serial}</v>`}</c><c r="B${r}" s="29"${day?' t="inlineStr"':''}>${day?'<is><t>DIURNO</t></is>':''}</c><c r="C${r}" s="29"${day?' t="inlineStr"':''}>${day?'<is><t>7h-19h</t></is>':''}</c><c r="D${r}" s="30"/><c r="E${r}" s="30"/></row>`}).join('');
 xml=xml.replace(/<sheetData>([\s\S]*?)<\/sheetData>/,(_,body)=>{const keep=body.replace(/<row\b[^>]*\br="(\d+)"[^>]*(?:\/>|>[\s\S]*?<\/row>)/g,(row:string,num:string)=>{const n=Number(num);if(n>=14&&n<=29)return '';if(n>=30&&extra)return row.replace(/\br="([A-Z]*)(\d+)"/g,(_:string,col:string,r:string)=>`r="${col}${Number(r)+extra}"`);return row});const pos=keep.search(/<row\b[^>]*\br="(?:30|[3-9]\d|\d{3,})"/);return '<sheetData>'+(pos<0?keep+generated:keep.slice(0,pos)+generated+keep.slice(pos))+'</sheetData>'});
 if(extra)xml=xml.replace(/<mergeCell ref="([^"]+)"/g,(whole,ref)=>`<mergeCell ref="${ref.replace(/([A-Z]+)(\d+)/g,(_:string,c:string,r:string)=>c+(Number(r)>=30?Number(r)+extra:r))}"`);
 const label=`Mês e ano de Competência: ${month.slice(5)}/${month.slice(0,4)}`;
 xml=xml.replace(/<c\b[^>]*\br="A10"[^>]*>[\s\S]*?<\/c>/,cell=>cell.replace(/ t="[^"]*"/,'').replace(/>.*$/s,` t="inlineStr"><is><t>${label}</t></is></c>`));
 files['xl/worksheets/sheet1.xml']=enc.encode(xml);return zip(files);
}
export function localMonth(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Fortaleza',year:'numeric',month:'2-digit'}).format(now).slice(0,7)}
export function previousMonth(now=new Date()){const [y,m]=localMonth(now).split('-').map(Number);return new Date(Date.UTC(y,m-2,1)).toISOString().slice(0,7)}
