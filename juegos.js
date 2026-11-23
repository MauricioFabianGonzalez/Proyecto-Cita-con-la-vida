'use strict';
/* Cita con la Vida — Juegos de Lumi.
 * Sin cuentas, publicidad, pagos, seguimiento ni envío de respuestas.
 * Las preguntas y los personajes son datos locales del sitio.
 */
(() => {
  const $ = (id) => document.getElementById(id);
  const quizBank = Array.isArray(window.CITA_PREGUNTAS) ? window.CITA_PREGUNTAS : [];
  const charData = window.CITA_ADIVINA || { preguntas:[], personajes:[] };
  const byText = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    return el;
  };
  const show = (id, visible) => { const el = $(id); if (el) el.hidden = !visible; };
  const focusTitle = (id) => {
    const heading = $(id);
    if (heading) heading.focus({preventScroll:true});
  };
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shuffle = (source) => {
    const list = source.slice();
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // Pestañas accesibles con teclado y enlace directo.
  const tabs = [$('tab-quiz'), $('tab-adivina')];
  function selectTab(index, updateHash = true) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
    });
    show('panel-quiz', index === 0);
    show('panel-adivina', index === 1);
    if (updateHash) history.replaceState(null, '', index === 0 ? '#espadeo' : '#adivina');
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectTab(i));
    tab.addEventListener('keydown',(event)=>{
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = (i + (event.key === 'ArrowRight' ? 1 : 1)) % 2;
      selectTab(next);
      tabs[next].focus();
    });
  });
  const tabFromHash = () => location.hash === '#adivina' ? 1 : 0;
  selectTab(tabFromHash(), false);
  window.addEventListener('hashchange',()=>selectTab(tabFromHash(), false));

  // ==========================================
  // Espadeo Bíblico: 10 preguntas diferentes por ronda.
  // ==========================================
  let deck = [];
  let selectedQuestions = [];
  let questionIndex = 0;
  let correctCount = 0;
  let answerLog = [];
  let answerLocked = false;
  let currentQuestion = null;

  function nextTen() {
    if (deck.length < 10) deck = shuffle(quizBank);
    // Se consumen en tandas sin repetición entre rondas hasta agotar el mazo.
    return deck.splice(0,10);
  }
  function beginQuiz() {
    if (quizBank.length !== 300) {
      $('quiz-start').append(byText('p','games-error','No se pudo cargar el banco completo de preguntas. Actualizá la página.'));
      return;
    }
    selectedQuestions = nextTen();
    questionIndex = 0;
    correctCount = 0;
    answerLog = [];
    show('quiz-start',false);
    show('quiz-end',false);
    show('quiz-active',true);
    renderQuestion();
  }
  function renderQuestion() {
    const q = selectedQuestions[questionIndex];
    currentQuestion = q;
    answerLocked = false;
    $('quiz-counter').textContent = 'PREGUNTA ' + (questionIndex + 1) + ' DE 10';
    $('quiz-score').textContent = correctCount + (correctCount === 1 ? ' acierto' : ' aciertos');
    $('quiz-progress').setAttribute('aria-valuenow',String(questionIndex));
    $('quiz-progress').querySelector('span').style.width = (questionIndex * 10) + '%';
    $('quiz-topic').textContent = q.tema + ' · ' + (['','Nivel inicial','Nivel intermedio','Nivel avanzado'][q.nivel] || 'Nivel sorpresa');
    $('quiz-question').textContent = q.pregunta;
    $('quiz-options').replaceChildren();
    show('quiz-feedback',false);
    show('quiz-next',false);
    shuffle(q.opciones).forEach((choice,i)=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.append(byText('span','quiz-letter','ABCD'[i]),byText('span','quiz-choice',choice));
      btn.dataset.answer = choice;
      btn.addEventListener('click',()=>answerQuestion(choice));
      $('quiz-options').appendChild(btn);
    });
    focusTitle('quiz-question');
  }
  function answerQuestion(choice) {
    if (answerLocked) return;
    answerLocked = true;
    const q = currentQuestion;
    const right = choice === q.correcta;
    if (right) correctCount++;
    answerLog.push({question:q,chosen:choice,correct:right});
    $('quiz-score').textContent = correctCount + (correctCount === 1 ? ' acierto' : ' aciertos');
    for(const button of $('quiz-options').querySelectorAll('button')) {
      button.disabled = true;
      const answer = button.dataset.answer;
      if (answer === q.correcta) button.classList.add('is-correct');
      else if (answer === choice && !right) button.classList.add('is-wrong');
    }
    const feedback = $('quiz-feedback');
    feedback.replaceChildren();
    feedback.classList.toggle('feedback-right',right);
    feedback.classList.toggle('feedback-wrong',!right);
    feedback.append(
      byText('strong','',right ? '¡Excelente! 🎉 Punto para tu espada bíblica.' : '¡Casi! Esta pregunta venía con nivel «desierto de 40 días». 😄'),
      byText('p','',right ? '¡Respuesta correcta!' : 'La respuesta correcta era: '+q.correcta),
      byText('small','', 'Para comprobarlo, buscá: ' + q.referencia)
    );
    feedback.hidden = false;
    $('quiz-next').textContent = questionIndex === 9 ? 'Ver mi resultado ✳' : 'Siguiente pregunta →';
    show('quiz-next',true);
    $('quiz-next').focus({preventScroll:true});
  }
  function messageFor(score) {
    if(score === 10) return ['¡Enciclopedia bíblica con zapatillas!','¡Diez de diez! Si aparece una pregunta escondida detrás de un arbusto, seguro también la encontrás. Seguí aprendiendo con humildad y alegría.'];
    if(score === 9) return ['¡Guardia de honor de los pergaminos!','Te faltó una para el puntaje perfecto. Hasta los más sabios siguen buscando; ¡vos vas por excelente camino!'];
    if(score >= 7) return ['¡Espadachín bíblico de primera!','Tu espada está bien afilada. ¡Lumi te aplaude! Repasá lo que faltó y volvé por el diez.'];
    if(score >= 5) return ['¡Explorador valiente de la Palabra!','La mitad o más del desafío superado. Llevás buen ritmo; quedan historias increíbles por descubrir.'];
    if(score >= 3) return ['¡Aprendiz de los grandes relatos!','Todavía no abrís el mar con una respuesta, ¡pero ya estás dando pasos! Mirá las referencias y buscá tu revancha.'];
    return ['¡Primer entrenamiento con Lumi!','Hoy la espada estaba un poquito pesada 😄. Nadie nace sabiendo: cada versículo que descubrís es una victoria. ¡Otra partida!'];
  }
  function finishQuiz() {
    show('quiz-active',false);
    show('quiz-end',true);
    const [title,body] = messageFor(correctCount);
    $('quiz-result-title').textContent = title;
    $('quiz-result-score').textContent = correctCount + ' de 10 respuestas correctas · ' + (correctCount * 10) + '%';
    $('quiz-result-text').textContent = body;
    $('quiz-share-status').textContent = '';
    const wrap = $('quiz-review');
    wrap.replaceChildren();
    answerLog.forEach(({question,chosen,correct},index)=>{
      const item=document.createElement('details');
      item.className='quiz-review-item';
      if(!correct)item.open=true;
      const summary=byText('summary','', (correct ? '✓ ' : '↻ ') + (index+1)+'. '+question.pregunta);
      item.append(summary);
      const body=document.createElement('div');body.className='quiz-review-body';
      body.append(
        byText('p','', 'Elegiste: '+chosen),
        byText('p','', 'Respuesta correcta: '+question.correcta),
        byText('small','', 'Referencia bíblica: '+question.referencia)
      );
      item.append(body);wrap.append(item);
    });
    focusTitle('quiz-result-title');
  }
  $('quiz-begin').addEventListener('click',beginQuiz);
  $('quiz-restart').addEventListener('click',beginQuiz);
  $('quiz-next').addEventListener('click',()=>{
    if(!answerLocked)return;
    if(questionIndex===9)finishQuiz();
    else{questionIndex++;renderQuestion();}
  });
  $('quiz-share').addEventListener('click',async()=>{
    const url=new URL('juegos.html#espadeo',location.href).href;
    const text='¡Lumi me desafió en Espadeo Bíblico y logré '+correctCount+'/10! ¿Te animás a superarme?';
    try {
      if(navigator.share){await navigator.share({title:'Espadeo Bíblico · Cita con la Vida',text,url});$('quiz-share-status').textContent='¡Compartido!';}
      else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text+'\n'+url);$('quiz-share-status').textContent='¡Resultado copiado!';}
      else{window.prompt('Copiá el resultado:',text+' '+url);}
    }catch(e){if(e.name!=='AbortError')$('quiz-share-status').textContent='Podés compartir el enlace de esta página.';}
  });

  // ==========================================
  // Lumi adivina: interrogatorio adaptativo de rasgos.
  // ==========================================
  const chars=charData.personajes;
  const traits=charData.preguntas;
  const MAX_QUESTIONS=18;
  const MAX_GUESSES=5;
  let answers=[];
  let declined=new Set();
  let guessAttempts=0;
  let currentTrait=null;
  let currentGuess=null;
  const logo = (v) => Math.log(v);
  // Probabilidades suaves: una respuesta dudosa no descarta del todo a nadie.
  function scoreCandidates() {
    const scored=chars.filter(ch=>!declined.has(ch.nombre)).map(ch=>{
      const tags=new Set(ch.rasgos);
      let score=0;
      for(const ans of answers){
        if(ans.reply==='nose')continue;
        const has=tags.has(ans.id);
        const yes=ans.reply==='si'||ans.reply==='probable';
        const certainty=ans.reply==='probable' ? .7 : .88;
        score+=logo(yes===has ? certainty : (1-certainty));
      }
      return {character:ch,score};
    }).sort((a,b)=>b.score-a.score);
    const max=scored[0]?.score ?? 0;
    const weights=scored.map(o=>Math.exp(o.score-max));
    const total=weights.reduce((a,b)=>a+b,0);
    return scored.map((x,i)=>({...x,probability:total?weights[i]/total:0}));
  }
  function chooseTrait(ranked) {
    const used=new Set(answers.map(a=>a.id));
    const questions=traits.filter(t=>!used.has(t.id));
    if(!questions.length)return null;
    // Preguntas fáciles e intuitivas al comenzar.
    for(const id of ['antiguo','mujer']){
      const preferred=questions.find(x=>x.id===id);
      if(preferred&&answers.length<2)return preferred;
    }
    let best=null, bestMetric=-1;
    for(const q of questions){
      let positive=0;
      ranked.forEach(x=>{if(x.character.rasgos.includes(q.id))positive+=x.probability;});
      if(positive < .015 || positive > .985)continue;
      // Cuanto más equilibra las posibilidades, más útil es la pregunta.
      const information=4*positive*(1-positive);
      const topDifference=ranked.length>1 && ranked[0].character.rasgos.includes(q.id)!==ranked[1].character.rasgos.includes(q.id) ? .065:0;
      const tieBreak=Math.random()*.008;
      const metric=information+topDifference+tieBreak;
      if(metric>bestMetric){bestMetric=metric;best=q;}
    }
    return best;
  }
  function showGuess() {
    const ranked=scoreCandidates();
    if(!ranked.length){showLost();return;}
    currentGuess=ranked[0].character;
    show('guess-active',false);
    show('guess-start',false);
    show('guess-final',true);
    $('guess-title').textContent=guessAttempts===0 ? '¿Estás pensando en…?' : '¡Tengo otra sospecha! ¿Será…?';
    $('guess-character').textContent=currentGuess.nombre;
    $('guess-hint').textContent=currentGuess.pista;
    $('guess-reference').textContent='Pista bíblica: '+currentGuess.referencia;
    show('guess-confirm-actions',true);
    show('guess-epilogue',false);
    focusTitle('guess-title');
  }
  function showLost() {
    show('guess-active',false);
    show('guess-start',false);
    show('guess-final',true);
    $('guess-title').textContent='¡Esta vez me ganaste! 😅';
    $('guess-character').textContent='Lumi se quedó pensando…';
    $('guess-hint').textContent='Tal vez elegiste un personaje que aún no está en mi colección o alguna pista fue difícil de responder.';
    $('guess-reference').textContent='La Biblia tiene muchas más historias de las que entran en un juego.';
    show('guess-confirm-actions',false);
    $('guess-epilogue-message').textContent='¡Jugá otra vez! Voy a seguir aprendiendo personajes con las futuras actualizaciones.';
    show('guess-epilogue',true);
    focusTitle('guess-title');
  }
  function decideNext() {
    const ranked=scoreCandidates();
    if(!ranked.length){showLost();return;}
    const top=ranked[0], runner=ranked[1];
    const confident=answers.length>=8 && top.probability>.82 && (!runner || top.score-runner.score>2);
    const next=chooseTrait(ranked);
    if(answers.length>=MAX_QUESTIONS || confident || !next){
      showGuess();return;
    }
    currentTrait=next;
    show('guess-start',false);
    show('guess-final',false);
    show('guess-active',true);
    $('guess-counter').textContent='PREGUNTA '+(answers.length+1)+' DE HASTA '+MAX_QUESTIONS;
    $('guess-progress').setAttribute('aria-valuenow',String(answers.length));
    $('guess-progress').querySelector('span').style.width=Math.round(answers.length/MAX_QUESTIONS*100)+'%';
    $('guess-remaining').textContent='Lumi está siguiendo pistas ✳';
    $('guess-question').textContent=next.text;
    $('guess-back').disabled=answers.length===0;
    focusTitle('guess-question');
  }
  function startGuessing(){
    if(!chars.length||!traits.length){
      $('guess-start').append(byText('p','games-error','No se cargó la colección de personajes. Actualizá la página.'));return;
    }
    answers=[];declined=new Set();guessAttempts=0;currentTrait=null;currentGuess=null;
    decideNext();
  }
  $('guess-begin').addEventListener('click',startGuessing);
  $('guess-again').addEventListener('click',startGuessing);
  for (const btn of $('guess-answers').querySelectorAll('[data-answer]')){
    btn.addEventListener('click',()=>{
      if(!currentTrait)return;
      answers.push({id:currentTrait.id,reply:btn.dataset.answer});
      decideNext();
    });
  }
  $('guess-back').addEventListener('click',()=>{
    if(!answers.length)return;
    answers.pop();
    // Elegir la pregunta deshecha con prioridad para poder corregir su respuesta.
    decideNext();
  });
  $('guess-yes').addEventListener('click',()=>{
    show('guess-confirm-actions',false);
    $('guess-title').textContent='¡Lo sabía! Bueno… ¡casi magia! ✨';
    $('guess-epilogue-message').textContent='¡Acerté con '+currentGuess.nombre+'! Gracias por jugar. Leé su historia en '+currentGuess.referencia+' y desafiame de nuevo.';
    show('guess-epilogue',true);
    focusTitle('guess-title');
  });
  $('guess-no').addEventListener('click',()=>{
    declined.add(currentGuess.nombre);
    guessAttempts++;
    if(guessAttempts>=MAX_GUESSES || declined.size>=chars.length){showLost();return;}
    if(answers.length>=MAX_QUESTIONS){showGuess();return;}
    decideNext();
  });
})();
