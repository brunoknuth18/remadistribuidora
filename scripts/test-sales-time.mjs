import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const text=await fs.readFile('lib/sales-time.ts','utf8');const js=ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {weekStart,timeBucket,weekLabel}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
assert.equal(weekStart('2026-10-22'),'2026-10-19');assert.equal(weekStart('2026-10-25'),'2026-10-19');assert.equal(weekStart('2026-10-26'),'2026-10-26');assert.equal(weekStart('2026-01-01'),'2025-12-29');assert.equal(timeBucket('2026-10-22','month'),'2026-10');assert.equal(timeBucket('2026-10-22','year'),'2026');assert.equal(weekLabel('2025-12-29'),'29/12 a 04/01');
const data=JSON.parse(await fs.readFile('lib/sales-data.json','utf8'));for(const grain of ['day','week','month','year']){const totals=new Map();for(const r of data.rows){const key=timeBucket(r.date,grain);const v=totals.get(key)||[0,0];v[0]+=r.values[0][0];v[1]+=r.values[0][1];totals.set(key,v)}assert.equal(Math.round([...totals.values()].reduce((a,r)=>a+r[0],0)*100),190464759);assert.equal(Math.round([...totals.values()].reduce((a,r)=>a+r[1],0)*100),188217356)}
console.log('PASS: Monday–Sunday weeks, week/year boundaries, monthly/yearly buckets, totals preserved across every aggregation.');
