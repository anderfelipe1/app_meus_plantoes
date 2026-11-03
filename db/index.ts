import {remoteD1} from './remote-d1';
import {env} from 'cloudflare:workers';
import {drizzle} from 'drizzle-orm/d1';
import * as schema from './schema';
function externalSettings(){return {url:env.EXTERNAL_D1_URL||process.env.EXTERNAL_D1_URL,secret:env.EXTERNAL_D1_SECRET||process.env.EXTERNAL_D1_SECRET}}
export function databaseStatus(){const s=externalSettings();return {source:s.url&&s.secret?'app-medico':'Sites',urlConfigured:!!s.url,secretConfigured:!!s.secret}}
export function getDb(){const s=externalSettings();if(s.url||s.secret){if(!s.url||!s.secret)throw Error('Configuração incompleta da conexão app-medico.');return drizzle(remoteD1(s.url,s.secret) as unknown as D1Database,{schema});}if(!env.DB)throw Error('Banco de dados indisponível.');return drizzle(env.DB,{schema});}
