import {shiftPrice} from './shift-price';
export const SAFETY_SERVICES=['Plantão 12h','Eventos (Corridas, shows...)','Remoção Transporte Aéreo'];
export const OVERTIME_CENTS=10845,PRIVATE_CENTS=12050,PEDIATRIC_CENTS=24100;
export function calculateShift(b:{company:string,date:string,period?:string|null,service?:string,baseCents?:number,cents:number,pediatricCount?:number,pediatricCents?:number,overtimeHours?:number,privateCount?:number}){
 const safety=b.company==='Safety Med',service=safety?(b.service??SAFETY_SERVICES[0]):SAFETY_SERVICES[0];
 if(safety&&!SAFETY_SERVICES.includes(service))throw Error('Selecione uma modalidade válida.');
 const shift=!safety||service===SAFETY_SERVICES[0],fixed=shift?shiftPrice(b.company,b.date,b.period):null;
 const baseCents=fixed??b.baseCents??b.cents,pediatricCount=safety&&shift?(b.pediatricCount??0):0,pediatricCents=safety&&shift?(b.pediatricCents??PEDIATRIC_CENTS):PEDIATRIC_CENTS,overtimeHours=safety&&shift?(b.overtimeHours??0):0,privateCount=safety&&shift?(b.privateCount??0):0;
 if(!Number.isSafeInteger(baseCents)||baseCents<0||!Number.isSafeInteger(pediatricCount)||pediatricCount<0||!Number.isSafeInteger(pediatricCents)||pediatricCents<0||!Number.isFinite(overtimeHours)||overtimeHours<0||!Number.isSafeInteger(privateCount)||privateCount<0)throw Error('Confira os valores e as quantidades.');
 const cents=baseCents+pediatricCount*pediatricCents+Math.round(overtimeHours*OVERTIME_CENTS)+privateCount*PRIVATE_CENTS;if(!Number.isSafeInteger(cents))throw Error('Valor total inválido.');
 return {service,baseCents,pediatricCount,pediatricCents,overtimeHours,privateCount,period:b.company==='Remoções avulsas'||!shift?null:(b.period??null),cents};
}
