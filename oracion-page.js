'use strict';
(function(){
  const form=document.getElementById('prayer-form');
  const notice=document.getElementById('prayer-notice');
  const title=document.getElementById('prayer-status-title');
  const status=document.getElementById('prayer-status-text');
  const fallback=document.getElementById('prayer-copy');
  const link=document.getElementById('send-via-facebook');
  if(!form)return;
  function showManual(message){
    fallback.hidden=false;fallback.value=message;
    fallback.focus();
    fallback.select();
    status.textContent='No pudimos copiar automáticamente en este navegador. Seleccioná y copiá el texto que aparece abajo; después abrí Facebook y mandalo por mensaje privado.';
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const name=document.getElementById('prayer-name').value.trim();
    const category=document.getElementById('prayer-category').value;
    const prayer=document.getElementById('prayer-text').value.trim();
    if(prayer.length<8){document.getElementById('prayer-text').focus();return}
    const message=[
      'Hola, Cita con la Vida Trelew. Me gustaría compartir un motivo de oración:',
      '',
      'Motivo: '+category,
      name?'Nombre: '+name:'',
      'Pedido: '+prayer,
      '',
      'Muchas gracias por acompañarme en oración.'
    ].filter(line=>line!==null).join('\n');
    notice.hidden=false;
    fallback.hidden=true;
    title.textContent='Tu mensaje está preparado.';
    status.textContent='El pedido todavía NO se envió. Copiamos el texto para que abras Facebook y lo pegues en un mensaje privado a la página.';
    try{
      if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error('No clipboard');
      await navigator.clipboard.writeText(message);
    }catch(_){showManual(message)}
    notice.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  });
  link.addEventListener('click',()=>{
    // Intencionalmente no se marca como enviado: enviar depende de Facebook.
  });
})();
