import {requireManager} from '../../../lib/admin-pages';
import {loadSalesData} from '../../../lib/portal-db';
import {monitorSummary} from '../../../lib/monitor-model';
import Monitor from './screen';
import {loadCitySales} from '../../../lib/city-sales';
export const dynamic='force-dynamic';
export default async function Page(){await requireManager();const summary=monitorSummary(await loadSalesData());summary.citySales={};return <Monitor initial={summary}/>}
