export type TimeGrain='day'|'week'|'month'|'year';
export function weekStart(date:string){const d=new Date(date+'T00:00:00Z');const offset=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-offset);return d.toISOString().slice(0,10)}
export function timeBucket(date:string,grain:TimeGrain){return grain==='week'?weekStart(date):grain==='month'?date.slice(0,7):grain==='year'?date.slice(0,4):date}
export function weekLabel(start:string){const d=new Date(start+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+6);const end=d.toISOString().slice(0,10);return start.slice(8)+'/'+start.slice(5,7)+' a '+end.slice(8)+'/'+end.slice(5,7)}
