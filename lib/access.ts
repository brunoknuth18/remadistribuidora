export const TEST_SELLER_EMAIL='brunoknuth17@gmail.com';
export const MASTER_EMAIL='brunoknuth18@gmail.com';
export const ADMIN_EMAILS=[MASTER_EMAIL,'marketing@remadistribuidora.com.br','assistente.comercial@remadistribuidora.com.br','gestora.administrativa@remadistribuidora.com.br','diretor@remadistribuidora.com.br','diretor.financeiro@remadistribuidora.com.br'];
export const isAdmin=(email:string)=>ADMIN_EMAILS.includes(email.trim().toLowerCase());
export function adminRole(email:string){const normalized=email.trim().toLowerCase();return normalized===MASTER_EMAIL?'master':isAdmin(normalized)?'admin':null}
