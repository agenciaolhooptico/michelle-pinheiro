import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../docs');
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}const data=await readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[extname(file)]||'application/octet-stream'}).end(data);}catch{res.writeHead(404).end('Não encontrado');}}).listen(8768,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:8768'));
