import {redirect} from 'next/navigation';
import {getAdminSession} from './admin-session';
export async function requireManager(masterOnly=false){const user=await getAdminSession();if(!user)redirect('/admin/login');if(user.role==='seller')redirect('/minhas-metas');if(masterOnly&&user.role!=='master')redirect('/admin');return user}
