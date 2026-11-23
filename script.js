'use strict';
document.documentElement.classList.add('js');
const menuBtn = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-nav');
function setMenu(open){
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
}
menuBtn.addEventListener('click',()=>setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}})
  },{threshold:.08,rootMargin:'0px 0px 30px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
}else{document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('revealed'))}



// Actualización interactiva: progreso, navegación y volver arriba
(() => {
  const progress=document.getElementById('reading-progress');
  const topButton=document.getElementById('to-top');
  const links=Array.from(document.querySelectorAll('.desktop-nav a,.mobile-nav a'));
  const sections=Array.from(document.querySelectorAll('main section[id]'));
  let queued=false;
  function updateScroll(){
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    if(progress)progress.style.transform='scaleX('+Math.max(0,Math.min(1,window.scrollY/max))+')';
    if(topButton)topButton.hidden=window.scrollY<420;
    let active='';
    for(const sec of sections){if(sec.offsetTop<=window.scrollY+180)active=sec.id}
    for(const link of links){
      const current=link.getAttribute('href')==='#'+active;
      link.classList.toggle('current',current);
      if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    }
    queued=false;
  }
  window.addEventListener('scroll',()=>{
    if(!queued){queued=true;window.requestAnimationFrame(updateScroll)}
  },{passive:true});
  window.addEventListener('resize',updateScroll);
  if(topButton)topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  updateScroll();
})();

// Búsqueda y filtros de prédicas
(() => {
  const input=document.getElementById('sermon-search');
  const cards=Array.from(document.querySelectorAll('.sermon-detail'));
  if(!input||!cards.length)return;
  const buttons=Array.from(document.querySelectorAll('.sermon-filter'));
  const results=document.getElementById('sermon-results');
  const empty=document.getElementById('sermon-no-results');
  const expand=document.getElementById('sermon-expand');
  let category='all';
  const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const visibleCards=()=>cards.filter(el=>!el.hidden);
  function updateExpand(){
    if(!expand)return;
    const visible=visibleCards();
    expand.disabled=!visible.length;
    expand.textContent=visible.length&&visible.every(el=>el.open)?'Contraer todas':'Expandir todas';
  }
  function refresh(){
    const query=normalize(input.value);
    let count=0;
    for(const card of cards){
      const match=(category==='all'||card.dataset.topic===category)&&normalize(card.textContent).includes(query);
      card.hidden=!match;
      if(!match)card.open=false;else count++;
    }
    if(results)results.textContent=count+(count===1?' prédica disponible':' prédicas disponibles');
    if(empty)empty.hidden=count>0;
    updateExpand();
  }
  input.addEventListener('input',refresh);
  for(const button of buttons){
    button.addEventListener('click',()=>{
      category=button.dataset.topic;
      for(const other of buttons){
        const selected=other===button;
        other.classList.toggle('active',selected);
        other.setAttribute('aria-pressed',String(selected));
      }
      refresh();
    });
  }
  for(const card of cards)card.addEventListener('toggle',updateExpand);
  if(expand)expand.addEventListener('click',()=>{
    const visible=visibleCards(),openAll=visible.some(item=>!item.open);
    visible.forEach(item=>item.open=openAll);
    updateExpand();
  });
  const deepLink=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  if(deepLink&&deepLink.matches('.sermon-detail'))deepLink.open=true;
  refresh();
})();

// Galería: filtros, ampliación y navegación accesible por teclado
(() => {
  const photos=Array.from(document.querySelectorAll('.gallery-item'));
  const modal=document.getElementById('photo-lightbox');
  if(!modal||!photos.length)return;
  const filters=Array.from(document.querySelectorAll('.gallery-filter'));
  const fullImage=document.getElementById('photo-expanded');
  const caption=document.getElementById('photo-caption');
  const number=document.getElementById('photo-number');
  const previous=document.getElementById('photo-previous');
  const next=document.getElementById('photo-next');
  const close=document.getElementById('photo-close');
  let idx=0,previousFocus=null;
  const visiblePhotos=()=>photos.filter(p=>!p.hidden);
  function display(index){
    const arr=visiblePhotos();
    if(!arr.length)return;
    idx=(index+arr.length)%arr.length;
    const photo=arr[idx],original=photo.querySelector('img');
    fullImage.src=original.currentSrc||original.src;
    fullImage.alt=original.alt;
    caption.textContent=photo.querySelector('.gallery-caption')?.textContent||original.alt;
    number.textContent=(idx+1)+' / '+arr.length;
  }
  for(const button of filters){
    button.addEventListener('click',()=>{
      photos.forEach(p=>p.hidden=button.dataset.filter!=='all'&&p.dataset.category!==button.dataset.filter);
      filters.forEach(b=>{
        const selected=b===button;
        b.classList.toggle('active',selected);
        b.setAttribute('aria-pressed',String(selected));
      });
    });
  }
  for(const photo of photos){
    const trigger=photo.querySelector('.gallery-trigger');
    if(!trigger)continue;
    trigger.addEventListener('click',()=>{
      previousFocus=trigger;
      display(visiblePhotos().indexOf(photo));
      if(typeof modal.showModal==='function')modal.showModal();
    });
  }
  if(close)close.addEventListener('click',()=>modal.close());
  if(previous)previous.addEventListener('click',()=>display(idx-1));
  if(next)next.addEventListener('click',()=>display(idx+1));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
  modal.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();display(idx-1)}
    if(e.key==='ArrowRight'){e.preventDefault();display(idx+1)}
  });
  modal.addEventListener('close',()=>{
    fullImage.removeAttribute('src');
    if(previousFocus)previousFocus.focus();
  });
})();
