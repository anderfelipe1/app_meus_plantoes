import {recordOwner} from '../../../lib/record-owner';
import {calculateShift} from '../../../lib/calculate-shift';
import {getDb} from '../../../db';import {shifts} from '../../../db/schema';import {and,eq} from 'drizzle-orm';
export const dynamic='force-dynamic';
const companies=['Safety Med','Hospital Brites de Albuquerque','Remoções avulsas'];
export async function GET(req:Request){const owner=recordOwner(req.headers);if(!owner)return Response.json({error:'Entre na sua conta para continuar.'},{status:401});return Response.json(await getDb().select().from(shifts).where(eq(shifts.owner,owner)));}
export async function POST(req:Request){const owner=recordOwner(req.headers);if(!owner)return Response.json({error:'Acesso necessário'},{status:401});const b=await req.json();if(b.action==='delete'&&typeof b.id==='string'){await getDb().delete(shifts).where(and(eq(shifts.owner,owner),eq(shifts.id,b.id)));return Response.json({ok:true});}
const date=new Date(b.date+'T12:00:00Z');if(!companies.includes(b.company)||typeof b.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==b.date||typeof b.note!=='string'||b.note.length>1000)return Response.json({error:'Confira os campos.'},{status:400});
try{const data={...calculateShift(b),date:b.date,company:b.company,paid:b.paid?1:0,note:b.note};if(b.id)await getDb().update(shifts).set(data).where(and(eq(shifts.owner,owner),eq(shifts.id,b.id)));else await getDb().insert(shifts).values({...data,id:crypto.randomUUID(),owner});return Response.json({ok:true});}catch(e){return Response.json({error:(e as Error).message},{status:400})}}
