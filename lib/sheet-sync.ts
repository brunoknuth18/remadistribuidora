import {database,loadSalesData,saveSalesData} from './portal-db';
import {prepareSheetSnapshot,SHEET_SOURCE} from './sheet-sync-model';
export type SyncState={sourceModifiedAt?:string;lastCheckedAt?:number;lastSyncedAt?:number;lastAttemptAt?:number;status?:'success'|'error';error?:string;hash?:string;version?:string;rowCount?:number;lastDataDate?:string;total?:number;scheduleId?:string};
export async function readSyncState():Promise<SyncState>{const row=await database().prepare('SELECT value FROM portal_settings WHERE key=?').bind('sheet_sync_state').first<{value:string}>();return row?JSON.parse(row.value):{};}
async function stateWrite(state:SyncState){await database().prepare('INSERT INTO portal_settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind('sheet_sync_state',JSON.stringify(state)).run();}
export async function checkSheetSync(modifiedAt:string){const state=await readSyncState();return {source:SHEET_SOURCE,state,needsRead:state.status!=='success'||!state.version||state.sourceModifiedAt!==modifiedAt};}
export async function recordSheetCheck(modifiedAt:string){const state=await readSyncState();if(!state.lastSyncedAt||state.sourceModifiedAt!==modifiedAt)throw Error('Leia e publique a planilha antes de marcar esta revisão como conferida.');await stateWrite({...state,lastCheckedAt:Date.now(),status:'success',error:undefined});return readSyncState();}
export async function syncSheetSnapshot(values:unknown[][],modifiedAt:string,actor:string){
 const primary=await database().prepare('SELECT value FROM portal_settings WHERE key=?').bind('primary_commercial_source').first<{value:string}>();if(primary?.value==='onedrive_acompanhamento')throw Error('Fonte Google desativada. O acompanhamento usa exclusivamente OneDrive · DBA DIA - VENDEDORES.');const state=await readSyncState();try{if(!modifiedAt||!Number.isFinite(Date.parse(modifiedAt)))throw Error('A data de modificação da origem é obrigatória.');
 const data=prepareSheetSnapshot(values);const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(data)));const hash=[...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
 const current=await loadSalesData();let version=current.version||'legacy';const changed=state.hash!==hash||state.version!==version;
 if(changed)version=await saveSalesData(data,actor,version);
 const now=Date.now();await stateWrite({...state,status:'success',error:undefined,hash,version,sourceModifiedAt:modifiedAt,lastCheckedAt:now,lastSyncedAt:changed?now:state.lastSyncedAt||now,lastAttemptAt:now,rowCount:data.rows.length,lastDataDate:data.last,total:data.rows.reduce((sum,r)=>sum+r.values[0][1],0)});
 return {changed,state:await readSyncState()};
 }catch(e){await stateWrite({...state,status:'error',lastAttemptAt:Date.now(),error:e instanceof Error?e.message:'Falha na sincronização.'});throw e;}}
export async function recordSyncError(message:string){const state=await readSyncState();await stateWrite({...state,status:'error',error:message.slice(0,400),lastAttemptAt:Date.now()});return {ok:true};}
export async function setSyncSchedule(scheduleId:string){const state=await readSyncState();await stateWrite({...state,scheduleId});return {ok:true};}
