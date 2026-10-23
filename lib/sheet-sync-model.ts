import {prepareImport,parseDate,type ExtraMap} from './import-model';
export const SHEET_SOURCE={id:'1LSCWUeOAi2EOWpZ8cLFAXTxdVoD-94DNHb-PfzzrOM0',name:'Acompanhamento vendedores Outubro-26',sheet:'Gestão de Vendas',range:'A1:AD1000',url:'https://docs.google.com/spreadsheets/d/1LSCWUeOAi2EOWpZ8cLFAXTxdVoD-94DNHb-PfzzrOM0/edit'};
export function prepareSheetSnapshot(values:unknown[][]){
 if(!Array.isArray(values)||values.length<3||values.length>1000||values.some(r=>!Array.isArray(r)||r.length>30))throw Error('A leitura deve conter os cabeçalhos e no máximo 1.000 linhas de A:AD.');
 const norm=(s:unknown)=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,'').trim();
 const h=values[1].map(norm);if(h[0]!=='data'||h[1]!=='vendedor'||h[29]!=='supervisao'||h[2]!=='meta1'||h[3]!=='realizado1')throw Error('Os cabeçalhos da origem mudaram. A base anterior foi preservada.');
 if(values.length===1000&&values[999][0]&&values[999][1])throw Error('A planilha atingiu o limite de leitura. Amplie o intervalo antes de sincronizar.');
 const matrix=values.map((r,i)=>{const row=[...r];if(i>1&&typeof row[0]==='number'){const d=new Date(Date.UTC(1899,11,30)+Math.round(row[0])*86400000);row[0]=Number.isFinite(+d)?d.toISOString().slice(0,10):'';}return row;});
 const extras:ExtraMap[]=Array.from({length:8},(_,i)=>{const col=5+3*i,n=i+2;if(h[col]!==`meta${n}`||h[col+1]!==`realizado${n}`)throw Error('As colunas dos indicadores mudaram.');return {name:String(values[0][col]||`Indicador ${n}`),target:String(col),actual:String(col+1),unit:'number',targetRollup:'sum',actualRollup:'sum'};});
 const result=prepareImport(matrix,1,{date:'0',seller:'1',region:'29',rca:'',target:'2',actual:'3',weekTarget:'',monthTarget:''},extras,SHEET_SOURCE.name,SHEET_SOURCE.sheet);
 if(!result.data)throw Error(result.errors.slice(0,5).join(' '));
 if(result.data.rows.some(r=>!r.date.startsWith('2026-10-')))throw Error('Esta integração está vinculada a outubro/2026. Cadastre a próxima planilha antes de mudar o período.');
 return result.data;
}
