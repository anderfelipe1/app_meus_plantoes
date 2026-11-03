import type {getDb} from '../db';
import {frequencyReports,shifts} from '../db/schema';
import {and,eq,gte,lt} from 'drizzle-orm';
import {localMonth,previousMonth} from './frequency-workbook';
export async function syncFrequency(db:ReturnType<typeof getDb>,owner:string,month=previousMonth()){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||month>=localMonth())throw Error('A ata é liberada no dia 1º do mês seguinte à competência.');
 const existing=await db.select().from(frequencyReports).where(and(eq(frequencyReports.owner,owner),eq(frequencyReports.month,month))).limit(1);
 const [y,m]=month.split('-').map(Number),next=new Date(Date.UTC(y,m,1)).toISOString().slice(0,7);
 const records=await db.select().from(shifts).where(and(eq(shifts.owner,owner),eq(shifts.company,'Hospital Brites de Albuquerque'),gte(shifts.date,month+'-01'),lt(shifts.date,next+'-01')));
 const dates=JSON.stringify([...new Set(records.map(r=>r.date))].sort());
 if(dates==='[]'){if(existing.length)await db.delete(frequencyReports).where(eq(frequencyReports.id,existing[0].id));return null;}
 if(existing.length&&existing[0].dates===dates)return existing[0];
 const report={id:existing[0]?.id??crypto.randomUUID(),owner,month,dates,createdAt:new Date().toISOString(),downloadKey:null,downloadExpires:null};
 if(existing.length)await db.update(frequencyReports).set(report).where(eq(frequencyReports.id,report.id));else await db.insert(frequencyReports).values(report).onConflictDoUpdate({target:[frequencyReports.owner,frequencyReports.month],set:report});
 return report;
}
