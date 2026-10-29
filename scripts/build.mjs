import {mkdir,cp,readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
await mkdir(join(root,'docs'),{recursive:true});
await cp(join(root,'src'),join(root,'docs'),{recursive:true});
const html=await readFile(join(root,'docs/index.html'),'utf8');
for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 if(/^(https?:|mailto:|tel:)/.test(url))continue;
 await stat(join(root,'docs',url));
}
console.log('Build concluído. Referências locais verificadas. Publicação: docs/');
