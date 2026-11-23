'use strict';
/* Página de enlaces de Cita con la Vida. Compartir es siempre acción del visitante. */
(() => {
  const button=document.getElementById('links-share');
  const feedback=document.getElementById('links-share-feedback');
  if(!button||!feedback)return;
  button.addEventListener('click',async()=>{
    const url=location.href.split('#')[0];
    const text='Todos los enlaces de Cita con la Vida – Trelew. ¡Hay un lugar para vos!';
    try{
      if(navigator.share){
        await navigator.share({title:'Cita con la Vida · Trelew',text,url});
        feedback.textContent='¡Gracias por compartir!';
      }else if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(url);
        feedback.textContent='¡Enlace copiado! Ya podés compartirlo.';
      }else{
        window.prompt('Copiá el enlace:',url);
      }
    }catch(error){
      if(error?.name==='AbortError')return;
      feedback.textContent='Podés copiar la dirección de esta página para compartirla.';
    }
  });
})();