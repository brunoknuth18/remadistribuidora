import {getAdminSession} from '../../../lib/admin-session';
import {readSyncState} from '../../../lib/sheet-sync';
import {privateHeaders} from '../../../lib/http';
export async function GET(){const user=await getAdminSession();if(!user||user.role==='seller')return Response.json({message:'Acesso administrativo obrigatório.'},{status:403,headers:privateHeaders});return Response.json(await readSyncState(),{headers:privateHeaders});}
