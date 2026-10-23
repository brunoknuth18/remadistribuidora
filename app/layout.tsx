import type { Metadata, Viewport } from 'next';
import './globals.css';
import {loadBuilder} from '../lib/builder-store';
import {DEFAULT_BUILDER} from '../lib/builder-model';
import {PlatformProvider} from '../components/builder/platform-context';
export async function generateMetadata():Promise<Metadata>{try{const {config}=await loadBuilder(true);return {title:config.theme.title,description:config.theme.subtitle}}catch{return {title:DEFAULT_BUILDER.theme.title}}}
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#073d83'};
export default async function RootLayout({children}:{children:React.ReactNode}){let config=DEFAULT_BUILDER;try{config=(await loadBuilder(true)).config}catch{}const safeConfig={...config,sources:[],metrics:[],pages:config.pages.map(p=>({...p,blocks:[]}))};return <html lang="pt-BR" style={{'--blue':config.theme.primary,'--red':config.theme.accent} as React.CSSProperties}><body><PlatformProvider config={safeConfig}>{children}</PlatformProvider></body></html>}
