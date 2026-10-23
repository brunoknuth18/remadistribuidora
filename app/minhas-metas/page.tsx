import {redirect} from 'next/navigation';
import {getAdminSession} from '../../lib/admin-session';
import {loadSalesData,database} from '../../lib/portal-db';
import {sellerKey,summarize} from '../../lib/sales-model';
import type {RewardInputs} from '../../lib/reward-model';
import Dashboard from '../admin/dashboard';
import RewardCard from '../../components/portal/reward-card';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getAdminSession();if(!user)redirect('/admin/login');if(user.role!=='seller')redirect('/admin');const all=await loadSalesData();const rows=all.rows.filter(r=>sellerKey(r)===user.sellerKey);const data={...all,rows,importedBy:undefined};const month=rows.at(-1)?.date.slice(0,7)||all.last.slice(0,7);const totals=summarize(data,rows.filter(r=>r.date.startsWith(month)),0,'month');const saved=await database().prepare('SELECT payload FROM reward_inputs WHERE key=?').bind((user.sellerKey||'')+'|'+month).first<{payload:string}>();const input=saved?JSON.parse(saved.payload) as RewardInputs:null;const valid=input?.sourceVersion===all.version;return <Dashboard data={data} email={user.email} fullName={user.fullName} role="seller" rewardPanel={<RewardCard goal={totals.meta} actual={totals.real} month={month} input={valid?input:null} stale={!!input&&!valid}/>}/>}
