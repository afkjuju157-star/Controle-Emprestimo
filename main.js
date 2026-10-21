
"use strict";

const $ = (id) => document.getElementById(id);

const animeData = [
  {
    name: "Noragami", icon: "⛩️", number: 1,
    questions: [
      ["¿Qué es Yato?", ["Un dios", "Un demonio", "Un humano normal", "Un cazador de titanes"], 0],
      ["¿Qué desea conseguir Yato?", ["Un ejército", "Su propio santuario", "Una corona", "Una escuela"], 1],
      ["¿Cuánto cobra Yato normalmente por sus servicios?", ["5 yenes", "50 yenes", "500 yenes", "1000 yenes"], 0],
      ["¿Cuál es el apellido de Hiyori?", ["Iki", "Kugaha", "Kofuku", "Ikiro"], 0],
      ["¿Qué le ocurre a Hiyori tras salvar a Yato?", ["Se vuelve una diosa", "Su alma puede salir de su cuerpo", "Pierde la voz", "Se convierte en una Regalia"], 1],
      ["¿Quién es Yukine?", ["Una Regalia de Yato", "El hermano de Hiyori", "Un dios de la fortuna", "Un enemigo de Bishamon"], 0],
      ["¿En qué arma se transforma Yukine para Yato?", ["Un arco", "Una espada", "Un escudo", "Una cadena"], 1],
      ["¿Qué clase de diosa es Bishamon?", ["Diosa de la guerra", "Diosa de la cocina", "Diosa del amor", "Diosa de los sueños"], 0],
      ["¿Quién guía a las Regalias de Bishamon?", ["Kazuma", "Daikoku", "Tenjin", "Yukine"], 0],
      ["¿Qué es Kofuku en realidad?", ["Una diosa de la pobreza", "Una humana", "Una diosa del mar", "Una Regalia de Yato"], 0],
      ["¿Quién es la Regalia de Kofuku?", ["Daikoku", "Kazuma", "Nora", "Ebisu"], 0],
      ["¿De qué es dios Tenjin?", ["Del conocimiento", "De la guerra", "De la pobreza", "De los animales"], 0],
      ["¿Qué característica tiene Nora?", ["Sirve a varios dioses", "Es una estudiante de Hiyori", "Es hermana de Bishamon", "Es una humana sin poderes"], 0],
      ["¿Cuál es el subtítulo de la segunda temporada de Noragami?", ["Aragoto", "Shippuden", "Brotherhood", "Reborn"], 0],
      ["¿Cómo se llaman los seres sobrenaturales peligrosos de Noragami?", ["Ayakashi", "Titantes", "Hollows", "Homúnculos"], 0]
    ]
  },
  {
    name: "Naruto", icon: "🍥", number: 2,
    questions: [
      ["¿Cuál es el sueño de Naruto?", ["Ser Hokage", "Ser Kazekage", "Ser samurái", "Ser médico"], 0],
      ["¿Qué bestia está sellada dentro de Naruto?", ["Shukaku", "Kurama", "Gyuki", "Matatabi"], 1],
      ["¿Quién es el maestro del Equipo 7?", ["Asuma", "Kakashi", "Guy", "Iruka"], 1],
      ["¿Cuál es el apellido de Sasuke?", ["Uzumaki", "Nara", "Uchiha", "Hyuga"], 2],
      ["¿Qué técnica crea un orbe giratorio de chakra?", ["Chidori", "Rasengan", "Amaterasu", "Susanoo"], 1],
      ["¿Quién es el padre de Naruto?", ["Minato Namikaze", "Jiraiya", "Hiruzen Sarutobi", "Fugaku Uchiha"], 0],
      ["¿Cuál es el clan de Hinata?", ["Uchiha", "Hyuga", "Akimichi", "Inuzuka"], 1],
      ["¿Quién entrena a Naruto durante parte de su viaje?", ["Orochimaru", "Jiraiya", "Danzo", "Zabuza"], 1],
      ["¿Qué habilidad ocular caracteriza al clan Uchiha?", ["Byakugan", "Sharingan", "Rinnegan únicamente", "Jogan"], 1],
      ["¿Quién es el hermano mayor de Sasuke?", ["Madara", "Obito", "Itachi", "Shisui"], 2],
      ["¿Qué aldea es el hogar de Naruto?", ["Aldea de la Hoja", "Aldea de la Arena", "Aldea de la Niebla", "Aldea de la Roca"], 0],
      ["¿Quién es la compañera de equipo de Naruto y Sasuke?", ["Temari", "Sakura", "Ino", "Tenten"], 1],
      ["¿Qué organización lleva capas negras con nubes rojas?", ["ANBU", "Akatsuki", "Raíz", "Los Siete Espadachines"], 1],
      ["¿Quién es conocido como el ninja copiador?", ["Kakashi", "Neji", "Shikamaru", "Kiba"], 0],
      ["¿Qué rango busca alcanzar Naruto?", ["Hokage", "Jounin médico", "Daimyo", "Samurái"], 0]
    ]
  },
  {
    name: "One Piece", icon: "🏴‍☠️", number: 3,
    questions: [
      ["¿Qué quiere encontrar Luffy?", ["El One Piece", "Las siete bolas de dragón", "Un cuaderno mortal", "La piedra filosofal"], 0],
      ["¿Cómo se llama el barco de los Sombrero de Paja después del Going Merry?", ["Red Force", "Thousand Sunny", "Polar Tang", "Moby Dick"], 1],
      ["¿Cuál es el sueño de Zoro?", ["Ser el mejor espadachín", "Ser médico", "Encontrar el All Blue", "Ser rey"], 0],
      ["¿Qué profesión tiene Nami en la tripulación?", ["Navegante", "Cocinera", "Médica", "Carpintera"], 0],
      ["¿Quién es el cocinero de la tripulación?", ["Franky", "Sanji", "Usopp", "Brook"], 1],
      ["¿Qué poder obtiene Luffy al comer una fruta del diablo?", ["Elasticidad", "Control del hielo", "Invisibilidad", "Transformarse en dragón"], 0],
      ["¿Cuál es el nombre del hermano de Luffy que usa fuego?", ["Ace", "Buggy", "Law", "Koby"], 0],
      ["¿Quién es el médico reno de la tripulación?", ["Chopper", "Jinbe", "Bepo", "Carrot"], 0],
      ["¿Qué arma usa principalmente Usopp?", ["Honda y proyectiles", "Katana", "Tridente", "Hacha gigante"], 0],
      ["¿Qué es Robin?", ["Arqueóloga", "Navegante", "Médica", "Músico"], 0],
      ["¿Cómo se llama el tesoro que buscan los piratas?", ["One Piece", "All Blue", "Vivre Card", "Poneglyph"], 0],
      ["¿Quién es el capitán de los Sombrero de Paja?", ["Luffy", "Shanks", "Law", "Ace"], 0],
      ["¿Qué miembro de la tripulación es un esqueleto músico?", ["Brook", "Franky", "Zoro", "Jinbe"], 0],
      ["¿Quién construyó el Thousand Sunny?", ["Franky", "Usopp", "Iceburg", "Tom"], 0],
      ["¿Qué pez-hombre se une a la tripulación?", ["Jinbe", "Arlong", "Hody", "Fisher Tiger"], 0]
    ]
  },
  {
    name: "Dragon Ball Z", icon: "🐉", number: 4,
    questions: [
      ["¿Cuál es el nombre saiyajin de Goku?", ["Kakarotto", "Vegeta", "Bardock", "Raditz"], 0],
      ["¿Cómo se llama el hijo mayor de Goku?", ["Goten", "Gohan", "Trunks", "Broly"], 1],
      ["¿Qué técnica característica usa Goku?", ["Kamehameha", "Rasengan", "Getsuga Tensho", "Domain Expansion"], 0],
      ["¿Quién es el príncipe de los saiyajin?", ["Vegeta", "Piccolo", "Krillin", "Yamcha"], 0],
      ["¿Qué bolas reúnen para invocar a Shenlong?", ["Bolas de dragón", "Esferas mágicas negras", "Cristales del tiempo", "Joyas del infinito"], 0],
      ["¿Cuál es la raza de Freezer?", ["Una raza alienígena no identificada por nombre común", "Saiyajin", "Namekiano", "Androide"], 0],
      ["¿Quién entrena a Goku cuando es niño en el arte marcial?", ["Maestro Roshi", "Cell", "Beerus", "Nappa"], 0],
      ["¿Qué transformación tiene el cabello dorado y aumenta el poder saiyajin?", ["Super Saiyajin", "Modo Sabio", "Bankai", "Gear Five"], 0],
      ["¿De qué planeta procede Piccolo?", ["Namek", "Vegeta", "Tierra", "Yardrat"], 0],
      ["¿Quién es el padre de Gohan?", ["Goku", "Vegeta", "Piccolo", "Krillin"], 0],
      ["¿Quién absorbe a otros seres para alcanzar su forma perfecta?", ["Cell", "Frieza", "Nappa", "Babidi"], 0],
      ["¿Quién es el dios de la destrucción del universo 7?", ["Beerus", "Shenlong", "King Kai", "Supreme Kai"], 0],
      ["¿Qué personaje es un androide creado por el Dr. Gero?", ["Android 18", "Bulma", "Chi-Chi", "Videl"], 0],
      ["¿Quién se fusiona con Goku mediante la danza metamoru para crear a Gogeta?", ["Vegeta", "Gohan", "Trunks", "Piccolo"], 0],
      ["¿Cómo se llama el hijo menor de Goku?", ["Goten", "Gohan", "Pan", "Bulla"], 0]
    ]
  },
  {
    name: "Jujutsu Kaisen", icon: "👊", number: 5,
    questions: [
      ["¿Quién se traga el dedo maldito al comienzo de la historia?", ["Yuji Itadori", "Megumi Fushiguro", "Yuta Okkotsu", "Kento Nanami"], 0],
      ["¿Qué entidad está vinculada al cuerpo de Yuji?", ["Ryomen Sukuna", "Mahito", "Jogo", "Hanami"], 0],
      ["¿Quién es el profesor de cabello blanco y ojos cubiertos?", ["Satoru Gojo", "Suguru Geto", "Kento Nanami", "Aoi Todo"], 0],
      ["¿Qué técnica usa Megumi para invocar criaturas mediante sombras?", ["Técnica de las Diez Sombras", "Boogie Woogie", "Ratio", "Manipulación de sangre"], 0],
      ["¿Quién utiliza un martillo y clavos como armas?", ["Nobara Kugisaki", "Maki Zenin", "Shoko Ieiri", "Mai Zenin"], 0],
      ["¿Qué tipo de energía utilizan los hechiceros?", ["Energía maldita", "Ki saiyajin", "Chakra", "Reiatsu"], 0],
      ["¿Cuál es el nombre del compañero de Yuji conocido por su fuerza y personalidad excéntrica?", ["Aoi Todo", "Toge Inumaki", "Panda", "Kokichi Muta"], 0],
      ["¿Qué dice Toge Inumaki para evitar maldecir accidentalmente a otros con palabras normales?", ["Ingredientes de onigiri", "Nombres de animales", "Números", "Frases en latín"], 0],
      ["¿Qué rango tiene Gojo entre los hechiceros?", ["Especial", "Grado 4", "Grado 3", "Sin grado"], 0],
      ["¿Qué espíritu maldito puede cambiar la forma del alma?", ["Mahito", "Jogo", "Dagon", "Hanami"], 0],
      ["¿Qué objeto inicia el conflicto principal de Yuji?", ["Un dedo maldito de Sukuna", "Una espada legendaria", "Un libro mágico", "Un anillo"], 0],
      ["¿Quién es el amigo de Yuji que utiliza shikigami de sombras?", ["Megumi Fushiguro", "Panda", "Yuta Okkotsu", "Kento Nanami"], 0],
      ["¿Cómo se llama la escuela de los protagonistas en Tokio?", ["Colegio Técnico de Magia Metropolitana de Tokio", "Academia UA", "Aldea de la Hoja", "Escuela Karasuno"], 0],
      ["¿Quién fue compañero de Gojo durante su juventud?", ["Suguru Geto", "Toji Fushiguro", "Choso", "Noritoshi Kamo"], 0],
      ["¿Qué es Sukuna dentro de la historia?", ["El Rey de las Maldiciones", "Un maestro de escuela", "Un shikigami de Megumi", "Un espíritu protector"], 0]
    ]
  },
  {
    name: "Kimetsu no Yaiba", icon: "⚔️", number: 6,
    questions: [
      ["¿Quién es el protagonista de Kimetsu no Yaiba?", ["Tanjiro Kamado", "Zenitsu Agatsuma", "Inosuke Hashibira", "Giyu Tomioka"], 0],
      ["¿En qué se transforma Nezuko?", ["En demonio", "En cazadora de demonios", "En Pilar", "En cuervo"], 0],
      ["¿Qué organización combate a los demonios?", ["Cuerpo de Exterminio de Demonios", "Akatsuki", "Cuerpo de Exploración", "Escuela de Hechicería"], 0],
      ["¿Quién utiliza la respiración del trueno?", ["Zenitsu", "Inosuke", "Kanao", "Genya"], 0],
      ["¿Qué lleva Inosuke sobre la cabeza?", ["Una máscara de jabalí", "Un casco de samurái", "Una máscara de zorro", "Un sombrero de paja"], 0],
      ["¿Quién es el principal antagonista demoníaco?", ["Muzan Kibutsuji", "Akaza", "Doma", "Kokushibo"], 0],
      ["¿Qué color tiene inicialmente la espada Nichirin de Tanjiro?", ["Negro", "Azul", "Verde", "Blanco"], 0],
      ["¿Quién es el Pilar del Agua?", ["Giyu Tomioka", "Kyojuro Rengoku", "Tengen Uzui", "Sanemi Shinazugawa"], 0],
      ["¿Qué Pilar destaca por la respiración de la llama?", ["Kyojuro Rengoku", "Shinobu Kocho", "Muichiro Tokito", "Obanai Iguro"], 0],
      ["¿Cuál es el apellido de Tanjiro y Nezuko?", ["Kamado", "Agatsuma", "Kocho", "Tomioka"], 0],
      ["¿Qué instrumento utiliza Tamayo para ayudar en sus investigaciones?", ["Conocimientos médicos y experimentos", "Una katana maldita", "Un arco mágico", "Un cuaderno"], 0],
      ["¿Quién es el Pilar del Insecto?", ["Shinobu Kocho", "Mitsuri Kanroji", "Kanae Kocho", "Kanao Tsuyuri"], 0],
      ["¿Qué caracteriza a la familia de Tanjiro al comienzo?", ["Trabaja vendiendo carbón", "Es una familia real", "Vive en un castillo", "Son cazadores famosos"], 0],
      ["¿Quién entrena a Tanjiro antes de la selección final?", ["Sakonji Urokodaki", "Jigoro Kuwajima", "Shinjuro Rengoku", "Tengen Uzui"], 0],
      ["¿Qué objeto lleva Nezuko en la boca durante buena parte de la historia?", ["Un bozal de bambú", "Una máscara de hierro", "Una venda", "Un amuleto de piedra"], 0]
    ]
  }
];

let mode = "individual";
let selectedAnime = 1;
let roundQuestions = [];
let questionIndex = 0;
let score = 0;
let answered = false;
let currentQuestion = null;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderAnime() {
  const search = $("animeSearch").value.trim().toLowerCase();
  const grid = $("animeGrid");
  grid.innerHTML = "";

  const visible = animeData.filter(anime =>
    anime.name.toLowerCase().includes(search)
  );

  $("animeCount").textContent = `${animeData.length} animes`;

  visible.forEach(anime => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "anime-card" +
      (mode === "individual" && selectedAnime === anime.number ? " selected" : "");

    card.innerHTML = `
      <span class="anime-icon">${anime.icon}</span>
      <span class="anime-name">${anime.number === 1 ? "01 · " : ""}${anime.name}</span>
      <span class="anime-number">${anime.questions.length} preguntas disponibles</span>
      ${mode === "individual" && selectedAnime === anime.number
        ? '<span class="check">✓</span>' : ""}
    `;

    card.addEventListener("click", () => {
      selectedAnime = anime.number;
      renderAnime();
      $("setupMessage").textContent = "";
    });

    grid.appendChild(card);
  });

  if (visible.length === 0) {
    const empty = document.createElement("p");
    empty.className = "message";
    empty.textContent = "No se encontró ese anime en esta versión.";
    grid.appendChild(empty);
  }

  $("animePicker").classList.toggle("hidden", mode === "mixed");
}

function setMode(nextMode) {
  mode = nextMode;
  document.querySelectorAll(".mode-card").forEach(button => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  renderAnime();
}

function buildRound() {
  if (mode === "individual") {
    const anime = animeData.find(item => item.number === selectedAnime);
    if (!anime || anime.questions.length < 15) return null;

    return shuffle(anime.questions).slice(0, 15).map(question => ({
      anime: anime.name,
      question: question[0],
      options: question[1],
      correct: question[2]
    }));
  }

  const allQuestions = [];
  animeData.forEach(anime => {
    anime.questions.forEach(question => {
      allQuestions.push({
        anime: anime.name,
        question: question[0],
        options: question[1],
        correct: question[2]
      });
    });
  });

  if (allQuestions.length < 15) return null;
  return shuffle(allQuestions).slice(0, 15);
}

function startQuiz() {
  const questions = buildRound();

  if (!questions) {
    $("setupMessage").textContent =
      "Este anime todavía necesita 15 preguntas para iniciar.";
    return;
  }

  roundQuestions = questions;
  questionIndex = 0;
  score = 0;

  $("home").classList.add("hidden");
  $("quizResult").classList.add("hidden");
  $("quizScreen").classList.remove("hidden");

  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  answered = false;
  currentQuestion = roundQuestions[questionIndex];

  $("questionCounter").textContent = `${questionIndex + 1} / 15`;
  $("questionNumber").textContent =
    `PREGUNTA ${String(questionIndex + 1).padStart(2, "0")}`;
  $("questionText").textContent = currentQuestion.question;
  $("quizAnime").textContent =
    mode === "mixed" ? currentQuestion.anime : "MODO INDIVIDUAL";
  $("progressBar").style.width = `${(questionIndex / 15) * 100}%`;
  $("answerFeedback").textContent = "";
  $("answerFeedback").className = "feedback";
  $("nextButton").disabled = true;
  $("nextButton").textContent =
    questionIndex === 14 ? "VER RESULTADO →" : "SIGUIENTE →";

  const options = currentQuestion.options.map((text, originalIndex) => ({
    text,
    originalIndex
  }));

  const shuffledOptions = shuffle(options);
  const list = $("answerList");
  list.innerHTML = "";

  shuffledOptions.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span></span>
    `;
    button.querySelector("span:last-child").textContent = option.text;
    button.addEventListener("click", () => selectAnswer(button, option.originalIndex));
    list.appendChild(button);
  });
}

function selectAnswer(button, selectedIndex) {
  if (answered) return;
  answered = true;

  const correctIndex = currentQuestion.correct;
  const buttons = [...$("answerList").querySelectorAll(".answer-option")];

  buttons.forEach(optionButton => {
    optionButton.disabled = true;
  });

  const selectedText = button.querySelector("span:last-child").textContent;
  const correctText = currentQuestion.options[correctIndex];

  if (selectedIndex === correctIndex) {
    score++;
    button.classList.add("correct");
    $("answerFeedback").textContent = "✓ ¡Respuesta correcta!";
    $("answerFeedback").classList.add("good");
  } else {
    button.classList.add("wrong");
    $("answerFeedback").textContent = `✗ Incorrecto. Respuesta: ${correctText}`;
    $("answerFeedback").classList.add("bad");
    buttons.forEach(optionButton => {
      if (optionButton.querySelector("span:last-child").textContent === correctText) {
        optionButton.classList.add("correct");
      }
    });
  }

  $("progressBar").style.width = `${((questionIndex + 1) / 15) * 100}%`;
  $("nextButton").disabled = false;
}

function nextQuestion() {
  if (!answered) return;

  questionIndex++;
  if (questionIndex >= 15) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  $("quizScreen").classList.add("hidden");
  $("quizResult").classList.remove("hidden");

  const wrong = 15 - score;
  const accuracy = Math.round((score / 15) * 100);

  $("finalScore").textContent = score;
  $("correctCount").textContent = score;
  $("wrongCount").textContent = wrong;
  $("accuracy").textContent = `${accuracy}%`;

  if (score === 15) {
    $("resultIcon").textContent = "👑";
    $("resultTitle").textContent = "¡OTAKU LEGENDARIO!";
    $("resultMessage").textContent = "¡Perfecto! Has acertado todas las preguntas.";
  } else if (score >= 11) {
    $("resultIcon").textContent = "🔥";
    $("resultTitle").textContent = "¡EXCELENTE!";
    $("resultMessage").textContent = "Conoces muy bien este universo de anime.";
  } else if (score >= 7) {
    $("resultIcon").textContent = "⚡";
    $("resultTitle").textContent = "¡VAS POR BUEN CAMINO!";
    $("resultMessage").textContent = "Sigue practicando para convertirte en leyenda.";
  } else {
    $("resultIcon").textContent = "📺";
    $("resultTitle").textContent = "¡HORA DE VER MÁS ANIME!";
    $("resultMessage").textContent = "Repasa la historia y vuelve a intentarlo.";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  $("quizScreen").classList.add("hidden");
  $("quizResult").classList.add("hidden");
  $("home").classList.remove("hidden");
  renderAnime();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".mode-card").forEach(button => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

$("animeSearch").addEventListener("input", renderAnime);
$("startButton").addEventListener("click", startQuiz);
$("nextButton").addEventListener("click", nextQuestion);
$("exitButton").addEventListener("click", goHome);
$("retryButton").addEventListener("click", startQuiz);
$("homeButton").addEventListener("click", goHome);

renderAnime();

window.addEventListener("load", () => {
  setTimeout(() => {
    $("loader").classList.add("finished");
  }, 5000);
});
