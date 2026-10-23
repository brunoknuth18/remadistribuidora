import {redirect} from 'next/navigation';
import {getAdminSession} from '../../../lib/admin-session';
import {loadBuilder,loadDatasets,historyBuilder} from '../../../lib/builder-store';
import {sourceSecretStatus} from '../../../lib/builder-connections';
import {microsoftApp} from '../../../lib/microsoft-read';
import {database} from '../../../lib/portal-db';
import Studio from './studio';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getAdminSession();if(!user)redirect('/admin/login');if(!['master','admin_editor'].includes(user.role))redirect('/admin');const draft=await loadBuilder(),published=await loadBuilder(true);const datasets=await loadDatasets(draft.config,user.role as 'master'|'admin_editor');const secrets:Record<string,boolean>={};if(user.role==='master')for(const source of draft.config.sources)secrets[source.id]=await sourceSecretStatus(source.id);const errors=(await database().prepare("SELECT key,value FROM portal_settings WHERE key LIKE 'builder_error:%'").all<{key:string;value:string}>()).results;return <Studio initial={{draft,published,datasets,history:await historyBuilder() as {id:string;actor:string;created_at:number;label:string}[],secrets,errors:Object.fromEntries(errors.map(x=>[x.key.slice(14),JSON.parse(x.value)])),role:user.role as 'master'|'admin_editor',microsoftApp:user.role==='master'?await microsoftApp():null}}/>}
