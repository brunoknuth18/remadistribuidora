import {redirect} from 'next/navigation';
import {getAdminSession} from '../lib/admin-session';
import {database,seedRoster} from '../lib/portal-db';
import Login from './admin/login/form';
export const dynamic='force-dynamic';
export default async function Page(){await seedRoster(database());const user=await getAdminSession();if(user)redirect(user.role==='seller'?'/minhas-metas':'/admin');return <Login/>}
