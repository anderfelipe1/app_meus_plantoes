import {getDb} from '../db';
import {syncFrequency} from './frequency-store';
export async function generateFrequency(owner:string,month?:string,_replace=false){return syncFrequency(getDb(),owner,month)}
