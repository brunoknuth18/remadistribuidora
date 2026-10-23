import {redirect,notFound} from 'next/navigation';
import {getAdminSession} from '../../../lib/admin-session';
import {loadBuilder,loadDatasets} from '../../../lib/builder-store';
import Board from '../../../components/builder/board';
import Shell from '../../../components/portal/manager-shell';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}){const user=await getAdminSession();if(!user)redirect('/admin/login');if(user.role==='seller')redirect('/minhas-metas');const {slug}=await params,{config}=await loadBuilder(true);const page=config.pages.find(p=>p.slug===slug&&p.enabled);if(!page||!page.roles.includes(user.role))notFound();const needed=new Set(page.blocks.map(b=>config.metrics.find(m=>m.id===b.metricId)?.sourceId));const safeConfig={...config,sources:config.sources.filter(s=>needed.has(s.id)&&s.roles.includes(user.role as 'master'|'admin'|'admin_editor')).map(s=>({...s,url:'',driveId:'',itemId:''})),metrics:config.metrics.filter(m=>needed.has(m.sourceId))};const datasets=await loadDatasets(safeConfig,user.role);return <Shell title={page.title} description={page.description} master={user.role==='master'} editor={user.role==='admin_editor'}><Board page={page} config={safeConfig} datasets={datasets}/></Shell>}
