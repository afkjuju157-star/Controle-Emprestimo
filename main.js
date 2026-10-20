
"use strict";

const $ = id => document.getElementById(id);

const animeData = [
["Naruto","Acción","🍥"],["One Piece","Aventura","🏴‍☠️"],
["Dragon Ball Z","Acción","🐉"],["Kimetsu no Yaiba","Acción","🗡️"],
["Jujutsu Kaisen","Sobrenatural","👊"],["Death Note","Suspenso","📓"],
["Attack on Titan","Acción","🧱"],["Spy x Family","Comedia","🕵️"],
["Haikyuu!!","Deportes","🏐"],["Blue Lock","Deportes","⚽"],
["Sword Art Online","Fantasía","⚔️"],["Frieren","Fantasía","✨"],
["Sailor Moon","Magia","🌙"],["Cardcaptor Sakura","Magia","🌸"],
["Pokémon","Aventura","⚡"],["Chainsaw Man","Acción","🪚"],
["My Hero Academia","Acción","💥"],["Hunter x Hunter","Aventura","🎣"],
["Bleach","Acción","👻"],["Tokyo Ghoul","Suspenso","🩸"],
["Kaguya-sama: Love Is War","Romance","💘"],["Your Name","Romance","☄️"],
["Steins;Gate","Ciencia ficción","⏳"],
["Fullmetal Alchemist: Brotherhood","Aventura","⚙️"],
["Dandadan","Sobrenatural","👽"],["Dr. Stone","Ciencia ficción","🧪"],
["Black Clover","Fantasía","🍀"],["The Seven Deadly Sins","Fantasía","⚔️"],
["JoJo's Bizarre Adventure","Acción","⭐"],["Mob Psycho 100","Sobrenatural","🌪️"],
["Re:Zero","Fantasía","⏰"],["Violet Evergarden","Drama","✉️"],
["Bocchi the Rock!","Música","🎸"],["Kuroko no Basket","Deportes","🏀"],
["The Apothecary Diaries","Misterio","🌿"],["Oshi no Ko","Drama","⭐"],
["Solo Leveling","Acción","🗡️"],["Neon Genesis Evangelion","Ciencia ficción","🤖"],
["Assassination Classroom","Comedia","🐙"],["The Promised Neverland","Suspenso","🏡"],
["Code Geass","Ciencia ficción","♟️"],["Fruits Basket","Romance","🍙"],
["Toradora!","Romance","🐯"],["Vinland Saga","Aventura","🛡️"],
["Mushoku Tensei","Fantasía","🪄"],["Hellsing Ultimate","Acción","🦇"],
["Inuyasha","Aventura","🌕"],["Detective Conan","Misterio","🔎"]
].map((a,id)=>({id,name:a[0],genre:a[1],emoji:a[2]}));

const questions = [
["Naruto","¿Cuál es el sueño de Naruto?","Convertirse en Hokage","Ser Rey de los Piratas","Encontrar las Esferas del Dragón","Ser el mejor cazador",0],
["Naruto","¿Cómo se llama el zorro dentro de Naruto?","Shukaku","Kurama","Gyūki","Son Gokū",1],
["One Piece","¿Qué quiere encontrar Luffy?","El One Piece","El Death Note","Las Esferas del Dragón","La Piedra Filosofal",0],
["One Piece","¿Qué poder tiene Luffy?","Controlar hielo","Estirar su cuerpo como goma","Viajar en el tiempo","Leer mentes",1],
["Dragon Ball Z","¿Cómo se llama el protagonista?","Vegeta","Piccolo","Goku","Krillin",2],
["Dragon Ball Z","¿Qué se reúne para invocar a Shenlong?","Anillos","Esferas del Dragón","Pergaminos","Cristales mágicos",1],
["Kimetsu no Yaiba","¿Cómo se llama la hermana de Tanjiro?","Mikasa","Nezuko","Nobara","Sakura",1],
["Jujutsu Kaisen","¿Quién es el maestro de cabello blanco?","Satoru Gojo","Suguru Geto","Nanami","Megumi",0],
["Death Note","¿Qué es Ryuk?","Un ninja","Un shinigami","Un titán","Un alquimista",1],
["Attack on Titan","¿Quién quiere acabar con los titanes?","Eren Yeager","Levi Ackerman","Armin Arlert","Jean Kirstein",0],
["Spy x Family","¿Cuál es el nombre en clave de Loid?","Twilight","Nightfall","Daybreak","Black Swan",0],
["Haikyuu!!","¿Qué deporte juegan?","Baloncesto","Fútbol","Voleibol","Béisbol",2],
["Blue Lock","¿Cuál es el objetivo de Blue Lock?","Crear al delantero definitivo","Entrenar ninjas","Buscar un tesoro","Ganar voleibol",0],
["Sword Art Online","¿Qué ocurre a los jugadores atrapados?","No pueden cerrar sesión con seguridad","Se vuelven piratas","Viajan al pasado","Pierden la voz",0],
["Frieren","¿Qué tipo de ser es Frieren?","Una elfa maga","Una sirena","Una androide","Una humana sin magia",0],
["Sailor Moon","¿Cuál es la identidad de Sailor Moon?","Usagi Tsukino","Rei Hino","Makoto Kino","Ami Mizuno",0],
["Cardcaptor Sakura","¿Qué cartas reúne Sakura?","Cartas Clow","Cartas Pokémon","Cartas ninja","Cartas de fútbol",0],
["Pokémon","¿Cuál es el Pokémon más famoso de Ash?","Charmander","Pikachu","Squirtle","Eevee",1],
["Chainsaw Man","¿Qué demonio está unido a Denji?","Demonio Zorro","Pochita","Demonio Luna","Demonio Dragón",1],
["My Hero Academia","¿Cómo se llama el protagonista?","Izuku Midoriya","Shoto Todoroki","Katsuki Bakugo","Tenya Iida",0],
["Hunter x Hunter","¿Qué quiere encontrar Gon?","A su padre","Un cuaderno mortal","Un tesoro pirata","Un dragón",0],
["Bleach","¿Qué puede ver y combatir Ichigo?","Hollows","Titanes","Piratas","Pokémon",0],
["Kaguya-sama: Love Is War","¿Qué quieren conseguir Kaguya y Miyuki?","Que el otro confiese su amor","Ganar fútbol","Ser cazadores","Encontrar un tesoro",0],
["Your Name","¿Qué fenómeno conecta a Mitsuha y Taki?","Intercambio de cuerpos","Un torneo","Un cuaderno mágico","Un videojuego",0],
["Steins;Gate","¿Qué tema científico aparece en la serie?","Viajes en el tiempo","Alquimia","Pokémon","Voleibol",0],
["Fullmetal Alchemist: Brotherhood","¿Qué buscan los hermanos Elric?","La Piedra Filosofal","El One Piece","El Death Note","Una espada",0],
["Dandadan","¿Qué investigan Momo y Okarun?","Aliens y espíritus","Piratas y ninjas","Dragones y robots","Deportes",0],
["Dr. Stone","¿Qué intenta reconstruir Senku?","La civilización mediante la ciencia","Un reino pirata","Una escuela de héroes","Un equipo deportivo",0],
["Black Clover","¿Qué quiere llegar a ser Asta?","Rey Mago","Hokage","Rey Pirata","Detective",0],
["The Seven Deadly Sins","¿Quién es el capitán del grupo?","Meliodas","Ban","King","Escanor",0],
["JoJo's Bizarre Adventure","¿Qué apellido comparten varios protagonistas?","Joestar","Forger","Elric","Ackerman",0],
["Mob Psycho 100","¿Qué habilidad tiene Mob?","Poderes psíquicos","Controlar titanes","Ser alquimista","Hablar con Pokémon",0],
["Re:Zero","¿Qué habilidad especial tiene Subaru?","Regresar tras morir","Leer mentes","Volar sin magia","Detener el tiempo para siempre",0],
["Violet Evergarden","¿En qué trabaja Violet?","Escribe cartas para otros","Es detective","Juega voleibol","Es pirata",0],
["Bocchi the Rock!","¿Qué instrumento toca Hitori?","Guitarra","Violín","Trompeta","Batería",0],
["Kuroko no Basket","¿Qué deporte aparece en la serie?","Baloncesto","Voleibol","Tenis","Rugby",0],
["The Apothecary Diaries","¿Cómo se llama la protagonista?","Maomao","Frieren","Sakura","Kaguya",0],
["Oshi no Ko","¿En qué mundo se desarrolla la historia?","Industria del entretenimiento","Piratería espacial","Alquimia","Ninjas",0],
["Solo Leveling","¿Cómo se llama el protagonista?","Sung Jinwoo","Yuji Itadori","Eren Yeager","Loid Forger",0],
["Neon Genesis Evangelion","¿Qué pilotan los protagonistas?","Unidades Evangelion","Dragones","Naves piratas","Pokémon",0],
["Assassination Classroom","¿Cómo se llama el profesor amarillo?","Koro-sensei","All Might","Gojo","Ryuk",0],
["The Promised Neverland","¿Qué descubren los niños?","La verdad sobre el orfanato","Que son piratas","Que viven en un videojuego","Que viajan al tiempo",0],
["Code Geass","¿Qué poder obtiene Lelouch?","Geass, imponer órdenes","Controlar el agua","Transformarse en titán","Invocar Pokémon",0],
["Fruits Basket","¿Qué les sucede a algunos Sohma?","Se transforman en animales del zodiaco","Se vuelven piratas","Pierden la memoria","Viajan a Marte",0],
["Toradora!","¿Cómo se conoce a Taiga Aisaka?","Palmtop Tiger","Reina Pirata","Maga Escarlata","Diosa del Voleibol",0],
["Vinland Saga","¿Qué busca Thorfinn durante parte de la historia?","Venganza por su padre","Las Esferas del Dragón","Ser Hokage","Ser alquimista",0],
["Mushoku Tensei","¿En qué mundo renace el protagonista?","Un mundo de fantasía con magia","Un mundo sin vida","Una ciudad sin magia","Un mundo Pokémon",0],
["Hellsing Ultimate","¿Qué es Alucard?","Un poderoso vampiro","Un cazador de titanes","Un alquimista","Un entrenador Pokémon",0],
["Inuyasha","¿Qué tipo de ser es Inuyasha?","Mitad humano y mitad demonio","Un androide","Un shinigami","Un elfo",0],
["Detective Conan","¿Cuál es el nombre real de Conan?","Shinichi Kudo","L Lawliet","Light Yagami","Senku Ishigami",0]
].map((q,id)=>({id,anime:q[0],text:q[1],options:q.slice(2,6),answer:q[6]}));

const state={selected:new Set(),round:[],index:0,score:0,answered:false,lastCount:5};
const genre=$("genre-filter");

[...new Set(animeData.map(a=>a.genre))].sort().forEach(g=>{
  const opt=document.createElement("option");
  opt.value=g;opt.textContent=g;genre.append(opt);
});

function visibleAnimes(){
  const query=$("anime-search").value.trim().toLowerCase();
  return animeData.filter(a=>
    a.name.toLowerCase().includes(query) &&
    (genre.value==="all"||a.genre===genre.value)
  );
}

function renderAnimes(){
  const grid=$("anime-grid");
  grid.replaceChildren();

  visibleAnimes().forEach(a=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="anime-card"+(state.selected.has(a.id)?" selected":"");
    btn.setAttribute("aria-pressed",String(state.selected.has(a.id)));

    const check=document.createElement("span");
    check.className="check";
    check.textContent=state.selected.has(a.id)?"✓":"";

    const emoji=document.createElement("span");
    emoji.className="emoji";
    emoji.textContent=a.emoji;

    const name=document.createElement("span");
    name.className="name";
    name.textContent=a.name;

    const gen=document.createElement("span");
    gen.className="genre";
    gen.textContent=a.genre;

    btn.append(check,emoji,name,gen);
    btn.addEventListener("click",()=>{
      if(state.selected.has(a.id))state.selected.delete(a.id);
      else state.selected.add(a.id);
      renderAnimes();
      updateModes();
    });
    grid.append(btn);
  });

  $("selected-count").textContent=`${state.selected.size} seleccionados`;
  $("selection-hint").textContent=state.selected.size
    ?"¡Perfecto! Elige un desafío para comenzar."
    :"Selecciona tus animes para comenzar.";
}

function selectedQuestions(){
  const names=new Set(animeData.filter(a=>state.selected.has(a.id)).map(a=>a.name));
  return questions.filter(q=>names.has(q.anime));
}

function updateModes(){
  const available=selectedQuestions().length;
  document.querySelectorAll(".mode-card").forEach(btn=>{
    btn.disabled=available<Number(btn.dataset.count);
  });
  $("mode-hint").textContent=state.selected.size
    ?`Hay ${available} preguntas disponibles.`
    :"Selecciona animes para activar los desafíos.";
}

function shuffle(list){
  const arr=[...list];
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function startQuiz(count){
  const pool=shuffle(selectedQuestions());
  if(pool.length<count)return;

  state.round=pool.slice(0,count);
  state.index=0;
  state.score=0;
  state.answered=false;
  state.lastCount=count;

  $("setup").classList.add("hidden");
  $("mode-section").classList.add("hidden");
  $("results").classList.add("hidden");
  $("quiz").classList.remove("hidden");

  $("quiz-mode").textContent=count===5
    ?"MODO APRENDIZ":count===10?"MODO OTAKU":"MODO OTAKU LEGENDARIO";

  renderQuestion();
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderQuestion(){
  const q=state.round[state.index];
  state.answered=false;

  $("question-counter").textContent=`PREGUNTA ${state.index+1} / ${state.round.length}`;
  $("score-label").textContent=`⭐ ${state.score} puntos`;
  $("progress-fill").style.width=`${state.index/state.round.length*100}%`;
  $("question-category").textContent=q.anime.toUpperCase();
  $("question-text").textContent=q.text;
  $("answer-feedback").textContent="";
  $("next-question").classList.add("hidden");

  const box=$("answer-options");
  box.replaceChildren();

  q.options.forEach((option,index)=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="answer-option";
    btn.textContent=`${String.fromCharCode(65+index)}. ${option}`;
    btn.addEventListener("click",()=>answer(index,btn));
    box.append(btn);
  });
}

function answer(index,chosen){
  if(state.answered)return;
  state.answered=true;

  const q=state.round[state.index];
  const buttons=[...$("answer-options").querySelectorAll("button")];

  buttons.forEach((btn,i)=>{
    btn.disabled=true;
    if(i===q.answer)btn.classList.add("correct");
  });

  if(index===q.answer){
    state.score++;
    $("answer-feedback").textContent="¡Correcto! ¡Tu nivel otaku está subiendo!";
    $("answer-feedback").style.color="var(--green)";
  }else{
    chosen.classList.add("incorrect");
    $("answer-feedback").textContent=`La respuesta correcta es: ${q.options[q.answer]}.`;
    $("answer-feedback").style.color="var(--red)";
  }

  $("score-label").textContent=`⭐ ${state.score} puntos`;
  $("progress-fill").style.width=`${(state.index+1)/state.round.length*100}%`;
  $("next-question").textContent=state.index===state.round.length-1
    ?"Ver resultados →":"Siguiente pregunta →";
  $("next-question").classList.remove("hidden");
}

function nextQuestion(){
  if(!state.answered)return;
  if(state.index<state.round.length-1){
    state.index++;
    renderQuestion();
  }else showResults();
}

function showResults(){
  $("quiz").classList.add("hidden");
  $("results").classList.remove("hidden");

  const total=state.round.length;
  const percent=Math.round(state.score/total*100);

  $("final-score").textContent=`${state.score}/${total}`;
  $("final-percent").textContent=`${percent}% de respuestas correctas`;

  let icon="📘",title="¡Sigue entrenando!",message="Cada maestro otaku empezó como aprendiz.";
  if(percent===100){
    icon="👑";title="¡Otaku Supremo!";
    message="¡Perfecto! Conoces este universo como una verdadera leyenda.";
  }else if(percent>=80){
    icon="🔥";title="¡Nivel legendario!";
    message="Tu conocimiento del anime es impresionante.";
  }else if(percent>=60){
    icon="⚡";title="¡Otaku en ascenso!";
    message="Vas por buen camino. ¡Sigue entrenando!";
  }else if(percent>=40){
    icon="🎌";title="¡Buen comienzo!";
    message="Practica un poco más y vuelve a intentarlo.";
  }

  $("result-icon").textContent=icon;
  $("result-title").textContent=title;
  $("result-message").textContent=message;
  window.scrollTo({top:0,behavior:"smooth"});
}

function backHome(){
  $("quiz").classList.add("hidden");
  $("results").classList.add("hidden");
  $("setup").classList.remove("hidden");
  $("mode-section").classList.remove("hidden");
  updateModes();
  window.scrollTo({top:0,behavior:"smooth"});
}

$("anime-search").addEventListener("input",renderAnimes);
genre.addEventListener("change",renderAnimes);

$("select-all").addEventListener("click",()=>{
  visibleAnimes().forEach(a=>state.selected.add(a.id));
  renderAnimes();
  updateModes();
});

$("clear-selection").addEventListener("click",()=>{
  state.selected.clear();
  renderAnimes();
  updateModes();
});

document.querySelectorAll(".mode-card").forEach(btn=>{
  btn.addEventListener("click",()=>startQuiz(Number(btn.dataset.count)));
});

$("next-question").addEventListener("click",nextQuestion);
$("exit-quiz").addEventListener("click",backHome);
$("back-home").addEventListener("click",backHome);
$("retry-quiz").addEventListener("click",()=>startQuiz(state.lastCount));

renderAnimes();
updateModes();
