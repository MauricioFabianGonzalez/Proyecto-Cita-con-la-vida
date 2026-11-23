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
