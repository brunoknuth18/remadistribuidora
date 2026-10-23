import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {authAction,AuthError,digest,SESSION_COOKIE} from '../../../lib/admin-auth-core';
import {seedRoster} from '../../../lib/portal-db';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export async function POST(request:Request){
if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({message:'Origem não autorizada.'},{status:403,headers});
if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({message:'Formato inválido.'},{status:415,headers});
try{if(!env.DB||!env.AUTH_PEPPER)throw new AuthError(503,'O acesso administrativo está em configuração. Tente novamente em instantes.');const raw=await request.text();if(raw.length>4096)throw new AuthError(413,'Solicitação inválida.');let body;try{body=JSON.parse(raw)}catch{throw new AuthError(400,'Solicitação inválida.')}if(!body||typeof body!=='object'||Array.isArray(body))throw new AuthError(400,'Solicitação inválida.');
if(body.action==='logout'){const token=(await cookies()).get(SESSION_COOKIE)?.value;if(token)await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run();return Response.json({ok:true},{headers:{...headers,'Set-Cookie':`${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`}})}
await seedRoster(env.DB);
const result=await authAction({db:env.DB,pepper:env.AUTH_PEPPER},body,request.headers.get('cf-connecting-ip')||'unknown');
if('token' in result&&result.token)return Response.json({stage:'success',redirectTo:'redirectTo' in result?result.redirectTo:'/admin'},{headers:{...headers,'Set-Cookie':`${SESSION_COOKIE}=${result.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`}});
return Response.json(result,{headers});
}catch(error){const status=error instanceof AuthError?error.status:500;return Response.json({message:error instanceof AuthError?error.message:'Não foi possível concluir o acesso. Tente novamente em instantes.'},{status,headers})}}
