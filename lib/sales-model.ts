import {weekStart,timeBucket,type TimeGrain} from './sales-time';
export type Rollup='sum'|'week'|'month';
export type MetricSpec={unit:'money'|'number'|'percent';targetRollup:Rollup;actualRollup:Rollup};
export type SalesRow={date:string;seller:string;region:string;rca?:string;rosterId?:string;values:number[][];weekTarget?:number;monthTarget?:number;raw?:Record<string,string>};
export type SalesData={metrics:string[];rows:SalesRow[];source:string;period:string;first:string;last:string;metricSpecs?:MetricSpec[];kind?:'legacy'|'import';version?:string;importedAt?:number;importedBy?:string;sheet?:string};
export const sellerKey=(r:SalesRow)=>r.rosterId?'roster:'+r.rosterId:r.rca?'rca:'+r.rca:'name:'+r.seller;
function latestTotal(rows:SalesRow[],value:(r:SalesRow)=>number|undefined,period:'week'|'month'){const map=new Map<string,{date:string;value:number}>();for(const r of rows){const n=value(r);if(n===undefined)continue;const key=sellerKey(r)+':'+timeBucket(r.date,period);const prev=map.get(key);if(!prev||r.date>=prev.date)map.set(key,{date:r.date,value:n})}return [...map.values()].reduce((s,r)=>s+r.value,0)}
export function summarize(data:SalesData,rows:SalesRow[],metric:number,grain:TimeGrain='day'){
const spec=data.metricSpecs?.[metric];let meta:number;
if(metric===0&&grain!=='day'&&rows.some(r=>grain==='week'?r.weekTarget!==undefined:r.monthTarget!==undefined)){
const period=grain==='week'?'week':'month';const hasPeriod=(r:SalesRow)=>period==='week'?r.weekTarget:r.monthTarget;const keysWithTarget=new Set(rows.filter(r=>hasPeriod(r)!==undefined).map(r=>sellerKey(r)+':'+timeBucket(r.date,period)));
meta=latestTotal(rows,hasPeriod,period)+rows.filter(r=>!keysWithTarget.has(sellerKey(r)+':'+timeBucket(r.date,period))).reduce((s,r)=>s+r.values[metric][0],0);
}else meta=spec&&spec.targetRollup!=='sum'?latestTotal(rows,r=>r.values[metric][0],spec.targetRollup):rows.reduce((s,r)=>s+r.values[metric][0],0);
const real=spec&&spec.actualRollup!=='sum'?latestTotal(rows,r=>r.values[metric][1],spec.actualRollup):rows.reduce((s,r)=>s+r.values[metric][1],0);return {meta,real};}
export function groupSales(data:SalesData,rows:SalesRow[],dimension:'seller'|'region'|'period',metric:number,grain:TimeGrain){const map=new Map<string,SalesRow[]>();for(const r of rows){const key=dimension==='period'?timeBucket(r.date,grain):dimension==='seller'?sellerKey(r):r[dimension];const list=map.get(key)||[];list.push(r);map.set(key,list)}return [...map.entries()].map(([name,list])=>({name:dimension==='seller'?list[0].seller+(list[0].rca?' · RCA '+list[0].rca:''):name,...summarize(data,list,metric,grain)}))}
export const sellerOptions=(data:SalesData)=>[...new Map(data.rows.map(r=>[sellerKey(r),{key:sellerKey(r),name:r.seller,rca:r.rca||'',region:r.region}])).values()].sort((a,b)=>a.name.localeCompare(b.name));
export function weekdaysAfter(asOf:string,end:string){let n=0;const d=new Date(asOf+'T00:00:00Z');while(d.toISOString().slice(0,10)<end){d.setUTCDate(d.getUTCDate()+1);if(d.getUTCDay()!==0&&d.getUTCDay()!==6)n++}return n}
export function outlook(data:SalesData,rows:SalesRow[],asOf:string){const financial=summarize(data,rows,0,'month');const month=asOf.slice(0,7);const end=new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5,7)),0)).toISOString().slice(0,10);const remain=weekdaysAfter(asOf,end);return {...financial,gap:Math.max(financial.meta-financial.real,0),days:remain,daily:remain>0?Math.max(financial.meta-financial.real,0)/remain:null};}
