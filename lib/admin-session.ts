import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {lookupSession,SESSION_COOKIE} from './admin-auth-core';
export async function getAdminSession(){const token=(await cookies()).get(SESSION_COOKIE)?.value;if(!token||!env.DB)return null;return lookupSession(env.DB,token)}
