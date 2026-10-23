import {redirect} from 'next/navigation';
import {requireManager} from '../../../lib/admin-pages';
import {loadSalesData} from '../../../lib/portal-db';
import Shell from '../../../components/portal/manager-shell';
import Importer from './importer';
import SyncStatus from '../../../components/portal/sync-status';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requireManager();if(user.role==='admin_editor')redirect('/admin/editor');const data=await loadSalesData();return <Shell title="Importar acompanhamento" description="Selecione a planilha, confira as colunas e publique somente após revisar a prévia." master={user.role==='master'}><SyncStatus/><Importer currentVersion={data.version||'legacy'}/></Shell>}
