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
  // Espadeo Bíblico: clásico, infantil, familiar y revancha
  // ==========================================
  const TOTAL_QUIZ_QUESTIONS=10;
  const MISTAKES_KEY='cita-lumi-errores-v1';
  const modeInputs=Array.from(document.querySelectorAll('input[name="quiz-mode"]'));
  const playerInputs=Array.from(document.querySelectorAll('.quiz-player-name'));
  const playerLabels=Array.from(document.querySelectorAll('#quiz-player-names > label'));
  let quizMode='classic';
  let quizDecks={classic:[],kids:[]};
  let selectedQuestions=[];
  let questionIndex=0;
  let correctCount=0;
  let answerLog=[];
  let answerLocked=false;
  let currentQuestion=null;
  let players=[];
  let sessionMistakes=new Set();
  try{
    const saved=JSON.parse(sessionStorage.getItem(MISTAKES_KEY)||'[]');
    if(Array.isArray(saved))sessionMistakes=new Set(saved.filter(x=>typeof x==='string').slice(-60));
  }catch(_){/* Navegador privado: la sesión sigue funcionando */ }

  function saveMistakes(){
    try{sessionStorage.setItem(MISTAKES_KEY,JSON.stringify([...sessionMistakes].slice(-60)));}
    catch(_){/* No se recopilan datos en servidores */ }
    updateReviewOption();
  }
  function updateReviewOption(){
    const valid=[...sessionMistakes].filter(question=>quizBank.some(q=>q.pregunta===question));
    const visible=valid.length>0;
    $('quiz-review-choice').hidden=!visible;
    $('quiz-review-label').textContent=visible ? valid.length+' '+(valid.length===1?'pregunta para repasar':'preguntas para repasar') : 'Repasá las que te costaron';
    if(!visible && document.querySelector('input[name="quiz-mode"]:checked')?.value==='review'){
      modeInputs.find(x=>x.value==='classic').checked=true;
    }
  }
  function syncQuizMode(){
    quizMode=document.querySelector('input[name="quiz-mode"]:checked')?.value||'classic';
    const descriptions={
      classic:'10 preguntas de todo el banco, elegidas al azar. ¡Cada partida es distinta!',
      kids:'Preguntas de nivel inicial, botones grandes y aliento especial para quienes empiezan.',
      family:'De 2 a 4 jugadores por turnos. Cada uno responde 10 preguntas distintas con dificultad equilibrada.',
      review:'Volvé a practicar hasta 10 preguntas que te costaron en esta sesión.'
    };
    show('quiz-family-setup',quizMode==='family');
    $('quiz-mode-description').textContent=descriptions[quizMode]||descriptions.classic;
    $('quiz-begin').textContent=quizMode==='family'?'¡Comenzar competencia! →':quizMode==='kids'?'¡A jugar con Lumi! →':quizMode==='review'?'¡Quiero mi revancha! →':'¡Acepto el desafío! →';
    document.body.classList.toggle('quiz-kids-selected',quizMode==='kids');
  }
  function updatePlayerFields(){
    const n=Number($('quiz-player-count').value);
    playerLabels.forEach((label,i)=>{label.hidden=i>=n;});
  }
  modeInputs.forEach(input=>input.addEventListener('change',syncQuizMode));
  $('quiz-player-count').addEventListener('change',updatePlayerFields);
  updateReviewOption();
  updatePlayerFields();
  syncQuizMode();

  function drawWithoutRepeats(pool,deckName,n){
    if(pool.length<n)return shuffle(pool);
    if(!quizDecks[deckName]||quizDecks[deckName].length<n){
      quizDecks[deckName]=shuffle(pool);
    }
    return quizDecks[deckName].splice(0,n);
  }
  function buildFamilyQuestions(){
    const count=players.length;
    const taken=new Set();
    const draw=(level,n)=>{
      const candidates=shuffle(quizBank.filter(q=>q.nivel===level&&!taken.has(q.pregunta)));
      const chosen=candidates.slice(0,n);
      chosen.forEach(q=>taken.add(q.pregunta));
      return chosen;
    };
    const perPlayer=[];
    for(let p=0;p<count;p++){
      const cards=[...draw(1,5),...draw(2,4),...draw(3,1)];
      if(cards.length<TOTAL_QUIZ_QUESTIONS){
        const fill=shuffle(quizBank.filter(q=>!taken.has(q.pregunta))).slice(0,TOTAL_QUIZ_QUESTIONS-cards.length);
        fill.forEach(q=>taken.add(q.pregunta));cards.push(...fill);
      }
      perPlayer.push(shuffle(cards));
    }
    const turns=[];
    for(let round=0;round<TOTAL_QUIZ_QUESTIONS;round++){
      for(let p=0;p<count;p++)turns.push({question:perPlayer[p][round],playerIndex:p,round:round+1});
    }
    return turns;
  }
  function prepareQuestions(){
    if(quizMode==='family'){
      const amount=Number($('quiz-player-count').value);
      const usedNames=new Set();
      players=playerInputs.slice(0,amount).map((input,i)=>{
        const name=(input.value.trim().slice(0,24)||'Jugador '+(i+1));
        let unique=name;
        if(usedNames.has(name.toLowerCase()))unique+=' ('+(i+1)+')';
        usedNames.add(unique.toLowerCase());
        return {name:unique,correct:0,answered:0};
      });
      return buildFamilyQuestions();
    }
    players=[];
    let sample=[];
    if(quizMode==='kids'){
      sample=drawWithoutRepeats(quizBank.filter(q=>q.nivel===1),'kids',TOTAL_QUIZ_QUESTIONS);
    } else if(quizMode==='review'){
      sample=shuffle(quizBank.filter(q=>sessionMistakes.has(q.pregunta))).slice(0,TOTAL_QUIZ_QUESTIONS);
      if(!sample.length){quizMode='classic';sample=drawWithoutRepeats(quizBank,'classic',TOTAL_QUIZ_QUESTIONS);}
    } else {
      sample=drawWithoutRepeats(quizBank,'classic',TOTAL_QUIZ_QUESTIONS);
    }
    return sample.map((question,i)=>({question,playerIndex:0,round:i+1}));
  }
  function beginQuiz(){
    if(quizBank.length!==300){
      $('quiz-mode-description').textContent='No se pudo cargar el banco completo de preguntas. Actualizá la página.';
      return;
    }
    syncQuizMode();
    selectedQuestions=prepareQuestions();
    if(!selectedQuestions.length)return;
    questionIndex=0;correctCount=0;answerLog=[];answerLocked=false;
    show('quiz-start',false);
    show('quiz-end',false);
    show('quiz-active',true);
    show('quiz-handoff',false);
    show('quiz-family-results',false);
    document.body.classList.toggle('quiz-kids-active',quizMode==='kids');
    $('quiz-progress').setAttribute('aria-valuemax',String(selectedQuestions.length));
    renderQuestion();
  }
  function renderFamilyBoard(){
    const board=$('quiz-family-board');
    board.replaceChildren();
    if(quizMode!=='family'){board.hidden=true;return;}
    board.hidden=false;
    const active=selectedQuestions[questionIndex]?.playerIndex;
    players.forEach((player,i)=>{
      const cell=byText('span',i===active?'family-player is-active':'family-player',player.name+': '+player.correct+'/10');
      board.append(cell);
    });
  }
  function renderQuestion(){
    const entry=selectedQuestions[questionIndex],q=entry.question;
    currentQuestion=q;answerLocked=false;
    const total=selectedQuestions.length;
    const player=quizMode==='family'?players[entry.playerIndex]:null;
    $('quiz-counter').textContent=player
      ? 'RONDA '+entry.round+' DE 10 · '+player.name.toUpperCase()
      : 'PREGUNTA '+(questionIndex+1)+' DE '+total+(quizMode==='kids'?' · INFANTIL':quizMode==='review'?' · REVANCHA':'');
    $('quiz-score').textContent=player
      ? player.name+': '+player.correct+(player.correct===1?' acierto':' aciertos')
      : correctCount+(correctCount===1?' acierto':' aciertos');
    $('quiz-progress').setAttribute('aria-valuenow',String(questionIndex));
    $('quiz-progress').querySelector('span').style.width=(questionIndex/total*100)+'%';
    renderFamilyBoard();
    $('quiz-topic').textContent=q.tema+' · '+(quizMode==='kids'?'Nivel para empezar':(['','Nivel inicial','Nivel intermedio','Nivel avanzado'][q.nivel]||'Nivel sorpresa'));
    $('quiz-question').textContent=q.pregunta;
    $('quiz-options').replaceChildren();
    show('quiz-feedback',false);
    show('quiz-next',false);
    shuffle(q.opciones).forEach((choice,i)=>{
      const btn=document.createElement('button');btn.type='button';btn.className='quiz-option';
      btn.append(byText('span','quiz-letter','ABCD'[i]),byText('span','quiz-choice',choice));
      btn.dataset.answer=choice;
      btn.addEventListener('click',()=>answerQuestion(choice));
      $('quiz-options').appendChild(btn);
    });
    focusTitle('quiz-question');
  }
  function answerQuestion(choice){
    if(answerLocked)return;
    answerLocked=true;
    const q=currentQuestion,entry=selectedQuestions[questionIndex];
    const right=choice===q.correcta;
    if(right)correctCount++;
    if(quizMode==='family'){
      players[entry.playerIndex].answered++;
      if(right)players[entry.playerIndex].correct++;
    }
    answerLog.push({question:q,chosen:choice,correct:right,playerIndex:entry.playerIndex});
    if(right)sessionMistakes.delete(q.pregunta);
    else sessionMistakes.add(q.pregunta);
    saveMistakes();
    window.dispatchEvent(new CustomEvent('cita-lumi-reaccion',{detail:{tipo:right?'acierto':'intento'}}));
    $('quiz-score').textContent=quizMode==='family'
      ? players[entry.playerIndex].name+': '+players[entry.playerIndex].correct+' aciertos'
      : correctCount+(correctCount===1?' acierto':' aciertos');
    renderFamilyBoard();
    for(const button of $('quiz-options').querySelectorAll('button')){
      button.disabled=true;
      if(button.dataset.answer===q.correcta)button.classList.add('is-correct');
      else if(button.dataset.answer===choice&&!right)button.classList.add('is-wrong');
    }
    const feedback=$('quiz-feedback');feedback.replaceChildren();
    feedback.classList.toggle('feedback-right',right);feedback.classList.toggle('feedback-wrong',!right);
    const positive=quizMode==='kids'?'¡Sí! ¡Qué bien lo hiciste! 🌟':'¡Excelente! 🎉 Punto para tu espada bíblica.';
    const encouragement=quizMode==='kids'?'¡Una pregunta para aprender! No pasa nada, vamos juntos. 💛':'¡Casi! Esta pregunta venía con nivel «desierto de 40 días». 😄';
    feedback.append(
      byText('strong','',right?positive:encouragement),
      byText('p','',right?'¡Respuesta correcta!':'La respuesta correcta era: '+q.correcta),
      byText('small','','Buscá la historia en tu Biblia: '+q.referencia)
    );
    feedback.hidden=false;
    const atEnd=questionIndex===selectedQuestions.length-1;
    $('quiz-next').textContent=atEnd?'Ver resultado ✳':quizMode==='family'?'Pasar el turno →':'Siguiente pregunta →';
    show('quiz-next',true);
    $('quiz-next').focus({preventScroll:true});
  }
  function messageFor(score){
    if(quizMode==='kids'){
      if(score===10)return ['¡Lumi está saltando de alegría! 🌟','¡Diez estrellas para vos! ¡Qué divertido descubrir las historias de la Biblia juntos!'];
      if(score>=7)return ['¡Pequeño gran explorador! 🐣','¡Muy bien! Lumi te manda un abrazo imaginario. Cada respuesta te ayuda a aprender más.'];
      if(score>=4)return ['¡Aventura bíblica desbloqueada! 🎈','¡Qué lindo que te animaste! Mirá las respuestas y probá otra vez cuando quieras.'];
      return ['¡Lumi te regala una sonrisa! 💛','¡Aprender es lo más importante! Leé con alguien las historias que aparecen abajo y volvé a jugar.'];
    }
    if(score===10)return ['¡Enciclopedia bíblica con zapatillas!','¡Diez de diez! Si aparece una pregunta escondida detrás de un arbusto, seguro también la encontrás. Seguí aprendiendo con humildad y alegría.'];
    if(score===9)return ['¡Guardia de honor de los pergaminos!','Te faltó una para el puntaje perfecto. Hasta los más sabios siguen buscando; ¡vos vas por excelente camino!'];
    if(score>=7)return ['¡Espadachín bíblico de primera!','Tu espada está bien afilada. ¡Lumi te aplaude! Repasá lo que faltó y volvé por el diez.'];
    if(score>=5)return ['¡Explorador valiente de la Palabra!','La mitad o más del desafío superado. Llevás buen ritmo; quedan historias increíbles por descubrir.'];
    if(score>=3)return ['¡Aprendiz de los grandes relatos!','Todavía no abrís el mar con una respuesta, ¡pero ya estás dando pasos! Mirá las referencias y buscá tu revancha.'];
    return ['¡Primer entrenamiento con Lumi!','Hoy la espada estaba un poquito pesada 😄. Nadie nace sabiendo: cada versículo que descubrís es una victoria. ¡Otra partida!'];
  }
  function finishQuiz(){
    show('quiz-active',false);show('quiz-end',true);
    document.body.classList.remove('quiz-kids-active');
    $('quiz-share-status').textContent='';
    const board=$('quiz-family-results');board.replaceChildren();
    if(quizMode==='family'){
      const highest=Math.max(...players.map(p=>p.correct));
      const leaders=players.filter(p=>p.correct===highest);
      const tied=leaders.length>1;
      $('quiz-result-title').textContent=tied?'¡Tenemos un empate épico! 🤝':'¡'+leaders[0].name+' gana la contienda! 🏆';
      $('quiz-result-score').textContent=correctCount+' aciertos de '+selectedQuestions.length+' preguntas en familia';
      $('quiz-result-text').textContent=tied?'¡Qué gran equipo! Empataron con '+highest+' puntos cada uno. En esta familia la Palabra nos sigue reuniendo.':'¡Gran batalla bíblica! '+leaders[0].name+' se lleva los aplausos, pero todos sumaron historias para aprender.';
      const title=byText('h3','review-title','Marcador de la familia');board.append(title);
      players.map((player,i)=>({...player,index:i})).sort((a,b)=>b.correct-a.correct).forEach((player,index)=>{
        const row=document.createElement('div');row.className='family-score-row'+(player.correct===highest?' is-winner':'');
        row.append(byText('span','family-score-rank',player.correct===highest?'🏅':String(index+1)),
          byText('strong','family-score-name',player.name),
          byText('span','family-score-points',player.correct+'/10'));
        board.append(row);
      });
      board.hidden=false;
      $('quiz-review').previousElementSibling.textContent='Repasemos juntos las preguntas';
    } else {
      const [title,body]=messageFor(correctCount);
      $('quiz-result-title').textContent=title;
      $('quiz-result-score').textContent=correctCount+' de '+selectedQuestions.length+' respuestas correctas · '+Math.round(correctCount/selectedQuestions.length*100)+'%';
      $('quiz-result-text').textContent=body;
      board.hidden=true;
      $('quiz-review').previousElementSibling.textContent='Tu repaso bíblico';
    }
    if(quizMode!=='family'&&correctCount>=7)window.dispatchEvent(new CustomEvent('cita-lumi-reaccion',{detail:{tipo:'celebrar'}}));
    const wrap=$('quiz-review');wrap.replaceChildren();
    answerLog.forEach(({question,chosen,correct,playerIndex},i)=>{
      const item=document.createElement('details');item.className='quiz-review-item';
      if(!correct)item.open=true;
      const name=quizMode==='family'?players[playerIndex].name+' · ':'';
      item.append(byText('summary','',(correct?'✓ ':'↻ ')+(i+1)+'. '+name+question.pregunta));
      const inner=document.createElement('div');inner.className='quiz-review-body';
      inner.append(
        byText('p','','Elegiste: '+chosen),
        byText('p','','Respuesta correcta: '+question.correcta),
        byText('small','','Referencia bíblica: '+question.referencia)
      );
      item.append(inner);wrap.append(item);
    });
    $('quiz-restart').textContent=quizMode==='family'?'¡Nueva competencia! ↻':quizMode==='review'?'Otra revancha ↻':'Otra ronda de 10 ↻';
    updateReviewOption();
    focusTitle('quiz-result-title');
  }
  function passTurn(){
    const next=selectedQuestions[questionIndex];
    if(!next)return;
    $('quiz-handoff-title').textContent='¡Le toca a '+players[next.playerIndex].name+'!';
    show('quiz-handoff',true);
    $('quiz-handoff-ready').focus({preventScroll:true});
  }
  $('quiz-handoff-ready').addEventListener('click',()=>{
    show('quiz-handoff',false);renderQuestion();
  });
  $('quiz-begin').addEventListener('click',beginQuiz);
  $('quiz-restart').addEventListener('click',()=>{
    if(quizMode==='review'&&sessionMistakes.size===0)quizMode='classic';
    beginQuiz();
  });
  $('quiz-next').addEventListener('click',()=>{
    if(!answerLocked)return;
    if(questionIndex===selectedQuestions.length-1){finishQuiz();return;}
    questionIndex++;
    if(quizMode==='family')passTurn();
    else renderQuestion();
  });
  $('quiz-share').addEventListener('click',async()=>{
    const url=new URL('juegos.html#espadeo',location.href).href;
    const text=quizMode==='family'
      ? 'Jugamos Espadeo Bíblico en familia y acertamos '+correctCount+' de '+selectedQuestions.length+'. ¡Vení a jugar también!'
      : '¡Lumi me desafió en Espadeo Bíblico y logré '+correctCount+'/'+selectedQuestions.length+'! ¿Te animás a superarme?';
    try{
      if(navigator.share){await navigator.share({title:'Espadeo Bíblico · Cita con la Vida',text,url});$('quiz-share-status').textContent='¡Compartido!';}
      else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text+'\n'+url);$('quiz-share-status').textContent='¡Resultado copiado!';}
      else window.prompt('Copiá el resultado:',text+' '+url);
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
    window.dispatchEvent(new CustomEvent('cita-lumi-reaccion', { detail:{tipo:'sospecha'} }));
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
    window.dispatchEvent(new CustomEvent('cita-lumi-reaccion', { detail:{tipo:'celebrar'} }));
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
