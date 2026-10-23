import {getAdminSession} from '../../../lib/admin-session';
import {database} from '../../../lib/portal-db';
import {AuthError} from '../../../lib/admin-auth-core';
import {errorResponse,privateHeaders} from '../../../lib/http';
export async function GET(){try{const user=await getAdminSession();if(!user||user.role==='seller')throw new AuthError(403,'Acesso administrativo obrigatório.');const history=await database().prepare('SELECT actor,action,subject,details,created_at FROM portal_audit ORDER BY created_at DESC LIMIT 100').all();return Response.json({history:history.results},{headers:privateHeaders})}catch(e){return errorResponse(e)}}
