import {requireManager} from '../../../lib/admin-pages';
import Shell from '../../../components/portal/manager-shell';
import Users from './users';
export const dynamic='force-dynamic';
export default async function Page(){await requireManager(true);return <Shell title="Pessoas e acessos" description="Convites individuais, perfis de acesso e vínculo entre conta e vendedor." master><Users/></Shell>}
