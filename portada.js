'use strict';
/* Cita con la Vida – Portada de enlaces
 * Sin seguimiento de visitas, cookies o registro de datos personales.
 */
(() => {
  const year=document.getElementById('year');
  if(year)year.textContent=String(new Date().getFullYear());
  const share=document.getElementById('share-portal');
  const feedback=document.getElementById('share-feedback');
  if(!share||!feedback)return;
  share.addEventListener('click',async()=>{
    const url=new URL('./',location.href).href;
    const message='Cita con la Vida – Trelew · Estamos acá para vos. 💛';
    try {
      if(navigator.share){
        await navigator.share({title:'Cita con la Vida · Trelew',text:message,url});
        feedback.textContent='¡Gracias por compartir!';
      }else if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(url);
        feedback.textContent='¡Enlace copiado para compartir!';
      }else{
        window.prompt('Copiá el enlace para compartir:',url);
      }
    }catch(error){
      if(error?.name==='AbortError')return;
      feedback.textContent='Podés compartir copiando la dirección de esta página.';
    }
  });
})();