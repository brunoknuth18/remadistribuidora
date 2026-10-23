'use client';
import {createContext,useContext} from 'react';
import {DEFAULT_BUILDER,type BuilderConfig} from '../../lib/builder-model';
const Context=createContext<BuilderConfig>(DEFAULT_BUILDER);
export function PlatformProvider({config,children}:{config:BuilderConfig;children:React.ReactNode}){return <Context.Provider value={config}>{children}</Context.Provider>}
export const usePlatform=()=>useContext(Context);
export function AreaLinks({role}:{role:'master'|'admin'|'admin_editor'|'seller'}){const c=usePlatform();if(role==='seller')return null;return <>{c.pages.filter(p=>p.enabled&&p.roles.includes(role)).map(p=><a key={p.id} href={'/areas/'+p.slug}>▦ <span>{p.title}</span></a>)}</>}
