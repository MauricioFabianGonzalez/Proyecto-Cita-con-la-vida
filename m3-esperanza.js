'use strict';
/* Vista previa del proyecto Un M³ de Esperanza.
 * El indicador de 32/50 es estrictamente una simulación.
 * No guarda información, procesa pagos ni comunica datos.
 */
(() => {
  const slider=document.getElementById('bag-slider');
  const bagGrid=document.getElementById('bag-grid');
  const counter=document.getElementById('bag-counter');
  const percent=document.getElementById('goal-percent');
  const fill=document.getElementById('progress-fill');
  const progress=document.getElementById('goal-progress');
  if(slider && bagGrid && counter && percent && fill && progress){
    const blocks=document.createDocumentFragment();
    const elements=[];
    for(let i=0;i<50;i++){
      const el=document.createElement('span');
      el.className='bag-brick';
      el.setAttribute('aria-hidden','true');
      blocks.appendChild(el);
      elements.push(el);
    }
    bagGrid.replaceChildren(blocks);
    const render=()=>{
      const n=Math.max(0,Math.min(50,Number(slider.value)||0));
      counter.textContent=String(n);
      percent.textContent=String(n*2)+'%';
      fill.style.width=(n*2)+'%';
      progress.setAttribute('aria-valuenow',String(n));
      progress.setAttribute('aria-valuetext',n+' de 50 bolsas equivalentes, simulación');
      elements.forEach((el,i)=>el.classList.toggle('active',i<n));
    };
    slider.addEventListener('input',render);
    render();
  }
  const share=document.getElementById('share-preview');
  const feedback=document.getElementById('share-feedback');
  if(share && feedback){
    share.addEventListener('click',async()=>{
      const url=new URL('m3-esperanza-vista-previa.html',location.href).href;
      const description='Mirá esta propuesta visual de «Un M³ de Esperanza», un proyecto de Cita con la Vida Trelew. Es una vista previa, no una campaña de aportes activa.';
      try{
        if(navigator.share){
          await navigator.share({title:'Un M³ de Esperanza · Vista previa',text:description,url});
          feedback.textContent='¡Gracias por compartir la idea!';
        }else if(navigator.clipboard?.writeText){
          await navigator.clipboard.writeText(description+'\n'+url);
          feedback.textContent='¡Enlace de la vista previa copiado!';
        }else{
          window.prompt('Copiá el enlace de esta vista previa:',url);
        }
      }catch(err){
        if(err?.name==='AbortError')return;
        feedback.textContent='También podés compartir la dirección de esta página.';
      }
    });
  }
})();
