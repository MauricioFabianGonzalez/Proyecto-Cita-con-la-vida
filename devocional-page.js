'use strict';
(function(){
  const zone='America/Argentina/Buenos_Aires';
  const base=Array.isArray(window.CITA_DEVOCIONALES_BASE)?window.CITA_DEVOCIONALES_BASE:[];
  const el=id=>document.getElementById(id);
  if(!base.length)return;
  function parts(date){return Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]))}
  function keyFor(date){const p=parts(date);return [p.year,String(p.month).padStart(2,'0'),String(p.day).padStart(2,'0')].join('-')}
  function dateFromKey(key){return new Date(key+'T12:00:00Z')}
  function move(key,days){
    const d=dateFromKey(key);d.setUTCDate(d.getUTCDate()+days);
    return [d.getUTCFullYear(),String(d.getUTCMonth()+1).padStart(2,'0'),String(d.getUTCDate()).padStart(2,'0')].join('-');
  }
  function fallback(key){
    const offset=Math.round((Date.parse(key+'T00:00:00Z')-Date.parse('2026-11-22T00:00:00Z'))/86400000);
    const index=((offset%base.length)+base.length)%base.length;
    const item=base[index];
    return {titulo:item.titulo,pasaje:item.pasaje,reflexion:item.reflexion,oracion:item.oracion,accion:item.accion};
  }
  let selected=keyFor(new Date());
  function formatDate(key){
    return new Intl.DateTimeFormat('es-AR',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(dateFromKey(key));
  }
  let current=null;
  let requestSerial=0;
  async function render(){
    const serial=++requestSerial;
    const today=keyFor(new Date());
    const key=selected;
    let devotional=fallback(key);
    if(key===today){
      try {
        const response=await fetch('devocional-hoy.json?fecha='+encodeURIComponent(key),{cache:'no-store'});
        if(response.ok){
          const data=await response.json();
          if(data&&data.fecha===key&&['titulo','pasaje','reflexion','oracion','accion'].every(k=>typeof data[k]==='string'&&data[k].trim()))devotional=data;
        }
      }catch(_){/* Sin red: continúa el devocional de respaldo */ }
    }
    if(serial!==requestSerial)return;
    current=devotional;
    el('daily-title').textContent=devotional.titulo;
    el('daily-reference').textContent='Lectura sugerida: '+devotional.pasaje;
    el('daily-reflection').textContent=devotional.reflexion;
    el('daily-prayer').textContent=devotional.oracion;
    el('daily-action').textContent=devotional.accion;
    const date=el('daily-date');
    date.dateTime=key;date.textContent=formatDate(key);
    el('next-devotional').disabled=key>=today;
    el('prev-devotional').disabled=move(today,-20)>key;
    el('today-devotional').disabled=key===today;
    el('daily-feedback').textContent='';
  }
  el('prev-devotional').addEventListener('click',()=>{if(!el('prev-devotional').disabled){selected=move(selected,-1);render()}});
  el('next-devotional').addEventListener('click',()=>{if(!el('next-devotional').disabled){selected=move(selected,1);render()}});
  el('today-devotional').addEventListener('click',()=>{selected=keyFor(new Date());render()});
  el('share-devotional').addEventListener('click',async()=>{
    if(!current)return;
    const text=[current.titulo,current.pasaje,current.reflexion,'', 'Leé el devocional en Cita con la Vida · Trelew:',location.href.split('#')[0]].join('\n');
    try{
      if(navigator.share)await navigator.share({title:current.titulo,text,url:location.href.split('#')[0]});
      else if(navigator.clipboard) {await navigator.clipboard.writeText(text);el('daily-feedback').textContent='¡Devocional copiado! Ya podés compartirlo.'}
      else {el('daily-feedback').textContent='Compartí el enlace de esta página con quien quieras.'}
    }catch(err){if(err.name!=='AbortError')el('daily-feedback').textContent='Podés compartir el enlace de esta página.'}
  });
  let lastToday=keyFor(new Date());
  window.setInterval(()=>{
    const now=keyFor(new Date());
    if(now!==lastToday){
      if(selected===lastToday){selected=now;render()}
      lastToday=now;
    }
  },60000);
  render();
})();
