import {requireManager} from '../../lib/admin-pages';
import {loadSalesData} from '../../lib/portal-db';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function Admin(){const user=await requireManager();const data=await loadSalesData();return <Dashboard data={data} email={user.email} fullName={user.fullName} role={user.role==='master'?'master':user.role==='admin_editor'?'admin_editor':'admin'}/>}
