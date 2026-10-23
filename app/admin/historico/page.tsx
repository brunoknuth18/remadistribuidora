import {requireManager} from '../../../lib/admin-pages';
import {database} from '../../../lib/portal-db';
import History from './history';
import Shell from '../../../components/portal/manager-shell';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requireManager();const rows=await database().prepare('SELECT actor,action,subject,details,created_at FROM portal_audit ORDER BY created_at DESC LIMIT 100').all<{actor:string;action:string;subject:string;details:string;created_at:number}>();return <Shell title="Histórico de alterações" description="Últimas 100 ações de acesso, gestão de usuários, importação e apuração de premiação." master={user.role==='master'} editor={user.role==='admin_editor'}><History rows={rows.results}/></Shell>}
