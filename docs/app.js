const menu=document.querySelector('.menu-button'),nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelectorAll('.treatment').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('.treatment').forEach(other=>{if(other!==detail)other.open=false;});}));
document.querySelector('#year').textContent=new Date().getFullYear();
