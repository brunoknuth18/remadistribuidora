import {redirect} from 'next/navigation';
import {requireManager} from '../../../lib/admin-pages';
import {loadSalesData} from '../../../lib/portal-db';
import Shell from '../../../components/portal/manager-shell';
import RewardEditor from './editor';
export const dynamic='force-dynamic';
export default async function Page(){const user=await requireManager();if(user.role==='admin_editor')redirect('/admin/editor');return <Shell title="Fechamento Vendedores" description="Calcule as comissões dos vendedores e confira os dados de fornecedores, variáveis e qualidade para o fechamento do período." master={user.role==='master'}><RewardEditor data={await loadSalesData()}/></Shell>}
