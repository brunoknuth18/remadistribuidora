import {summarize,groupSales,type SalesData} from './sales-model';
export function monitorSummary(data:SalesData,selectedMonth?:string,selectedRegion='',citySales:Record<string,number>={}){
 const months=[...new Set(data.rows.map(r=>r.date.slice(0,7)))].sort().reverse();
 const month=selectedMonth||months[0]||data.last.slice(0,7);
 const regions=[...new Set(data.rows.filter(r=>r.date.startsWith(month)).map(r=>r.region))].sort();
 const rows=data.rows.filter(r=>r.date.startsWith(month)&&(!selectedRegion||r.region===selectedRegion));
 const finance=summarize(data,rows,0,'month');
 const sellers=groupSales(data,rows,'seller',0,'month');
 const daily=groupSales(data,rows,'period',0,'day').sort((a,b)=>a.name.localeCompare(b.name));
 const regional=groupSales(data,rows,'region',0,'month').sort((a,b)=>b.real-a.real);
 return {citySales,month,months,regions,region:selectedRegion,finance,gap:Math.max(finance.meta-finance.real,0),sellers:sellers.length,achievers:sellers.filter(s=>s.meta>0&&s.real>=s.meta).length,
  indicators:data.metrics.slice(1).map((name,i)=>({name,...summarize(data,rows,i+1,'month'),unit:data.metricSpecs?.[i+1]?.unit||'number'})),
  daily,regional,lastDate:rows.map(r=>r.date).sort().at(-1)||null,latestDataDate:data.last,legacy:data.kind!=='import',importedAt:data.importedAt||null,consultedAt:Date.now(),recordCount:rows.length,
  targetBasis:rows.some(r=>r.monthTarget!==undefined)?'Meta mensal cadastrada':'Soma das metas diárias disponíveis',
  countBasis:data.sheet==='DBA DIA - VENDEDORES'?'Fonte: DBA DIA - VENDEDORES · diário somado; acumulados por vendedor/período, sem duplicação.':data.metricSpecs?.slice(1).some(m=>m.actualRollup!=='sum')?'Indicadores conforme agregação definida na importação.':'DN: soma dos registros; clientes podem se repetir entre dias.'};
}
export type MonitorData=ReturnType<typeof monitorSummary>;
