const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));nav.classList.toggle('open',expanded);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
document.querySelector('#year').textContent=new Date().getFullYear();
const descriptions=[
 ['Limpeza de pele','Um cuidado voltado à limpeza e à atenção às necessidades da pele. Na avaliação, converse sobre as etapas indicadas para você e sobre como manter uma rotina de cuidados em casa.'],
 ['Peelings','Uma possibilidade para trabalhar a renovação e o aspecto da pele. O tipo de peeling e os cuidados necessários devem ser discutidos com a profissional, considerando as características da sua pele.'],
 ['Microagulhamento','Um procedimento que pode integrar um planejamento de cuidado facial. A avaliação é essencial para entender a indicação, as limitações e os cuidados antes e depois de cada sessão.'],
 ['Tecnologias faciais','Recursos que podem complementar os cuidados com a pele dentro de um protocolo personalizado. Converse com a clínica sobre as tecnologias disponíveis e quais fazem sentido para o seu objetivo.'],
 ['Protocolos personalizados','Um plano construído a partir da sua pele, da sua rotina e das suas expectativas. Diferentes cuidados podem ser organizados em etapas, com orientações e acompanhamento definidos individualmente.']
];
const dialog=document.querySelector('#care-dialog');let trigger;
document.addEventListener('click',e=>{const button=e.target.closest('[data-care]');if(!button)return;trigger=button;const item=descriptions[Number(button.dataset.care)];document.querySelector('#dialog-title').textContent=item[0];document.querySelector('#dialog-copy').textContent=item[1];dialog.showModal();});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>trigger?.focus());
const viewport=document.querySelector('.care-window'),track=document.querySelector('.care-track'),pause=document.querySelector('#pause'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
const cards=[...track.children];
for(let i=0;i<2;i++)for(const card of cards){const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelector('button').tabIndex=-1;track.append(clone);}
let cycle=0,paused=reduce.matches,hover=false,focused=false,visible=false,pointer=null,dragged=false,last=0,travel=0,resumeAt=0;
function setCycle(){const first=track.children[0],next=track.children[cards.length];cycle=next.offsetLeft-first.offsetLeft;viewport.scrollLeft=cycle;}
function normalize(){if(!cycle)return;if(viewport.scrollLeft<cycle*.4)viewport.scrollLeft+=cycle;else if(viewport.scrollLeft>cycle*2.4)viewport.scrollLeft-=cycle;}
function sync(){pause.setAttribute('aria-pressed',String(paused));pause.innerHTML=paused?'Continuar movimento <span>▷</span>':'Pausar movimento <span>Ⅱ</span>';}
pause.addEventListener('click',()=>{paused=!paused;sync();});sync();
reduce.addEventListener('change',e=>{paused=e.matches;sync();});
new ResizeObserver(setCycle).observe(viewport);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(viewport);
viewport.addEventListener('scroll',normalize,{passive:true});
viewport.addEventListener('mouseenter',()=>hover=true);viewport.addEventListener('mouseleave',()=>hover=false);
viewport.addEventListener('focusin',e=>focused=e.target.matches(':focus-visible'));viewport.addEventListener('focusout',e=>{if(!viewport.contains(e.relatedTarget))focused=false;});
viewport.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;pointer={id:e.pointerId,start:e.clientX,last:e.clientX};dragged=false;});
window.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;if(Math.abs(e.clientX-pointer.start)>5){dragged=true;viewport.classList.add('dragging');}if(dragged){viewport.scrollLeft+=pointer.last-e.clientX;normalize();e.preventDefault();}pointer.last=e.clientX;},{passive:false});
window.addEventListener('pointerup',()=>{if(pointer){pointer=null;viewport.classList.remove('dragging');resumeAt=performance.now()+2000;}});
window.addEventListener('pointercancel',()=>{pointer=null;viewport.classList.remove('dragging');});
viewport.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false;}},true);
viewport.addEventListener('touchstart',()=>resumeAt=Infinity,{passive:true});viewport.addEventListener('touchend',()=>resumeAt=performance.now()+3000,{passive:true});viewport.addEventListener('touchcancel',()=>resumeAt=performance.now()+3000,{passive:true});
viewport.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();viewport.scrollLeft+=(e.key==='ArrowLeft'?-1:1)*180;resumeAt=performance.now()+4000;}});
function frame(t){const dt=Math.min(t-last,50);last=t;if(visible&&!paused&&!hover&&!focused&&!pointer&&!dialog.open&&t>resumeAt&&!document.hidden){travel+=dt*.018;const pixels=Math.floor(travel);if(pixels){viewport.scrollLeft+=pixels;travel-=pixels;normalize();}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
