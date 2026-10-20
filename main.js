
"use strict";

/* ==========================================
   DESAFIO OTAKU — seleção de animes e quiz
   ========================================== */

const $ = (id) => document.getElementById(id);

const ANIMES = [
  { name: "Fullmetal Alchemist", genres: ["Ação", "Fantasia"] },
  { name: "Naruto", genres: ["Ação", "Aventura"] },
  { name: "One Piece", genres: ["Ação", "Aventura"] },
  { name: "Dragon Ball", genres: ["Ação", "Fantasia"] },
  { name: "Demon Slayer", genres: ["Ação", "Fantasia", "Sobrenatural"] },
  { name: "Jujutsu Kaisen", genres: ["Ação", "Sobrenatural"] },
  { name: "Death Note", genres: ["Suspense", "Psicológico"] },
  { name: "Attack on Titan", genres: ["Ação", "Suspense"] },
  { name: "Spy x Family", genres: ["Comédia", "Ação"] },
  { name: "Haikyuu!!", genres: ["Esportes"] },
  { name: "Blue Lock", genres: ["Esportes"] },
  { name: "Sword Art Online", genres: ["Ação", "Isekai", "Fantasia"] },
  { name: "Frieren", genres: ["Fantasia", "Aventura"] },
  { name: "Sailor Moon", genres: ["Fantasia", "Romance"] },
  { name: "Sakura Card Captors", genres: ["Fantasia", "Aventura"] },
  { name: "Pokémon", genres: ["Aventura", "Fantasia"] },
  { name: "Chainsaw Man", genres: ["Ação", "Sobrenatural", "Terror"] },
  { name: "My Hero Academia", genres: ["Ação", "Aventura"] },
  { name: "Hunter x Hunter", genres: ["Ação", "Aventura"] },
  { name: "Bleach", genres: ["Ação", "Sobrenatural"] },
  { name: "Tokyo Ghoul", genres: ["Terror", "Suspense"] },
  { name: "Kaguya-sama: Love Is War", genres: ["Romance", "Comédia"] },
  { name: "Your Name", genres: ["Romance", "Fantasia"] },
  { name: "Steins;Gate", genres: ["Ficção científica", "Suspense"] }
];

/*
  Cada pergunta possui:
  anime, difficulty, question, options, answer e explanation.
  answer é a posição correta: 0, 1, 2 ou 3.
*/

const QUESTIONS = [
  // FULLMETAL ALCHEMIST
  {
    anime: "Fullmetal Alchemist", difficulty: "Fácil",
    question: "Quem é o irmão mais novo de Edward Elric?",
    options: ["Roy Mustang", "Alphonse Elric", "Ling Yao", "Scar"],
    answer: 1,
    explanation: "Alphonse é o irmão mais novo de Edward."
  },
  {
    anime: "Fullmetal Alchemist", difficulty: "Médio",
    question: "Qual é o apelido de Edward?",
    options: ["Alquimista de Aço", "Alquimista das Chamas", "Alquimista de Gelo", "Alquimista Carmesim"],
    answer: 0,
    explanation: "Edward é conhecido como o Alquimista de Aço."
  },

  // NARUTO
  {
    anime: "Naruto", difficulty: "Fácil",
    question: "Qual é o sonho de Naruto?",
    options: ["Ser Hokage", "Ser um samurai", "Ser pirata", "Ser médico"],
    answer: 0,
    explanation: "Naruto sonha em se tornar Hokage."
  },
  {
    anime: "Naruto", difficulty: "Médio",
    question: "Quem é o sensei do Time 7 no início da história?",
    options: ["Jiraiya", "Asuma", "Kakashi", "Iruka"],
    answer: 2,
    explanation: "Kakashi Hatake lidera o Time 7."
  },

  // ONE PIECE
  {
    anime: "One Piece", difficulty: "Fácil",
    question: "Qual é o sonho de Luffy?",
    options: ["Ser Hokage", "Ser Rei dos Piratas", "Ser Almirante", "Ser rei de Wano"],
    answer: 1,
    explanation: "Luffy quer se tornar o Rei dos Piratas."
  },
  {
    anime: "One Piece", difficulty: "Médio",
    question: "Quem é o espadachim dos Chapéus de Palha?",
    options: ["Sanji", "Usopp", "Franky", "Roronoa Zoro"],
    answer: 3,
    explanation: "Zoro é o espadachim da tripulação."
  },

  // DRAGON BALL
  {
    anime: "Dragon Ball", difficulty: "Fácil",
    question: "Qual é o nome saiyajin de Goku?",
    options: ["Vegeta", "Kakarotto", "Bardock", "Broly"],
    answer: 1,
    explanation: "Kakarotto é o nome saiyajin de Goku."
  },
  {
    anime: "Dragon Ball", difficulty: "Fácil",
    question: "Quantas Esferas do Dragão existem na busca clássica?",
    options: ["Cinco", "Seis", "Sete", "Nove"],
    answer: 2,
    explanation: "A coleção clássica possui sete esferas."
  },

  // DEMON SLAYER
  {
    anime: "Demon Slayer", difficulty: "Fácil",
    question: "Qual é o nome da irmã de Tanjiro?",
    options: ["Shinobu", "Mitsuri", "Nezuko", "Kanao"],
    answer: 2,
    explanation: "Nezuko é a irmã de Tanjiro Kamado."
  },
  {
    anime: "Demon Slayer", difficulty: "Médio",
    question: "Quem é conhecido como o Hashira das Chamas?",
    options: ["Giyu Tomioka", "Kyojuro Rengoku", "Muichiro Tokito", "Tengen Uzui"],
    answer: 1,
    explanation: "Kyojuro Rengoku é o Hashira das Chamas."
  },

  // JUJUTSU KAISEN
  {
    anime: "Jujutsu Kaisen", difficulty: "Fácil",
    question: "Quem é o protagonista da série?",
    options: ["Megumi Fushiguro", "Yuji Itadori", "Satoru Gojo", "Yuta Okkotsu"],
    answer: 1,
    explanation: "Yuji Itadori é o protagonista."
  },
  {
    anime: "Jujutsu Kaisen", difficulty: "Médio",
    question: "Qual entidade está ligada ao corpo de Yuji?",
    options: ["Mahito", "Sukuna", "Jogo", "Hanami"],
    answer: 1,
    explanation: "Yuji se torna o receptáculo de Sukuna."
  },

  // DEATH NOTE
  {
    anime: "Death Note", difficulty: "Fácil",
    question: "Quem encontra o Death Note?",
    options: ["L Lawliet", "Light Yagami", "Near", "Mello"],
    answer: 1,
    explanation: "Light Yagami encontra o caderno."
  },
  {
    anime: "Death Note", difficulty: "Fácil",
    question: "Qual shinigami está ligado ao caderno de Light?",
    options: ["Rem", "Ryuk", "Gelus", "Sidoh"],
    answer: 1,
    explanation: "Ryuk é o shinigami associado ao caderno."
  },

  // ATTACK ON TITAN
  {
    anime: "Attack on Titan", difficulty: "Fácil",
    question: "Quem é o protagonista no começo da história?",
    options: ["Levi Ackerman", "Eren Yeager", "Armin Arlert", "Jean Kirstein"],
    answer: 1,
    explanation: "Eren Yeager é o protagonista."
  },
  {
    anime: "Attack on Titan", difficulty: "Médio",
    question: "Qual corpo militar realiza expedições além das muralhas?",
    options: ["Polícia Militar", "Guarnição", "Tropa de Exploração", "Guarda Real"],
    answer: 2,
    explanation: "A Tropa de Exploração investiga o exterior."
  },

  // SPY X FAMILY
  {
    anime: "Spy x Family", difficulty: "Fácil",
    question: "Qual é o nome da filha adotiva de Loid e Yor?",
    options: ["Anya", "Nobara", "Nezuko", "Chika"],
    answer: 0,
    explanation: "Anya Forger faz parte da família Forger."
  },
  {
    anime: "Spy x Family", difficulty: "Médio",
    question: "Qual é a profissão secreta de Yor?",
    options: ["Espiã", "Assassina", "Detetive", "Médica"],
    answer: 1,
    explanation: "Yor trabalha secretamente como assassina."
  },

  // HAIKYUU!!
  {
    anime: "Haikyuu!!", difficulty: "Fácil",
    question: "Qual esporte é o foco da série?",
    options: ["Basquete", "Futebol", "Vôlei", "Tênis"],
    answer: 2,
    explanation: "Haikyuu!! acompanha jogadores de voleibol."
  },
  {
    anime: "Haikyuu!!", difficulty: "Fácil",
    question: "Qual é o primeiro nome do protagonista Hinata?",
    options: ["Shoyo", "Tobio", "Kei", "Tadashi"],
    answer: 0,
    explanation: "O protagonista é Shoyo Hinata."
  },

  // BLUE LOCK
  {
    anime: "Blue Lock", difficulty: "Fácil",
    question: "Qual esporte é o foco de Blue Lock?",
    options: ["Vôlei", "Futebol", "Basquete", "Beisebol"],
    answer: 1,
    explanation: "Blue Lock é sobre futebol."
  },
  {
    anime: "Blue Lock", difficulty: "Médio",
    question: "Quem é o protagonista de Blue Lock?",
    options: ["Rin Itoshi", "Meguru Bachira", "Yoichi Isagi", "Seishiro Nagi"],
    answer: 2,
    explanation: "Yoichi Isagi é o protagonista."
  },

  // SWORD ART ONLINE
  {
    anime: "Sword Art Online", difficulty: "Fácil",
    question: "Qual é o apelido mais conhecido de Kirito?",
    options: ["Espadachim Negro", "Alquimista de Aço", "Rei Demônio", "Ninja Branco"],
    answer: 0,
    explanation: "Kirito é conhecido como Espadachim Negro."
  },
  {
    anime: "Sword Art Online", difficulty: "Médio",
    question: "Qual é o nome da parceira mais conhecida de Kirito?",
    options: ["Sinon", "Asuna", "Alice", "Silica"],
    answer: 1,
    explanation: "Asuna é uma das principais personagens e parceira de Kirito."
  },

  // FRIEREN
  {
    anime: "Frieren", difficulty: "Fácil",
    question: "Qual é a espécie de Frieren?",
    options: ["Humana", "Elfa", "Demônio", "Anã"],
    answer: 1,
    explanation: "Frieren é uma elfa com vida extremamente longa."
  },
  {
    anime: "Frieren", difficulty: "Médio",
    question: "Qual é o nome da aprendiz humana de Frieren?",
    options: ["Fern", "Stark", "Aura", "Flamme"],
    answer: 0,
    explanation: "Fern é aprendiz de Frieren."
  },

  // SAILOR MOON
  {
    anime: "Sailor Moon", difficulty: "Fácil",
    question: "Qual é o nome civil da Sailor Moon?",
    options: ["Rei Hino", "Ami Mizuno", "Usagi Tsukino", "Makoto Kino"],
    answer: 2,
    explanation: "A protagonista é Usagi Tsukino."
  },
  {
    anime: "Sailor Moon", difficulty: "Médio",
    question: "Qual é o nome do gato preto que acompanha Usagi?",
    options: ["Artemis", "Luna", "Diana", "Chibi"],
    answer: 1,
    explanation: "Luna é a gata preta que orienta Usagi."
  },

  // SAKURA CARD CAPTORS
  {
    anime: "Sakura Card Captors", difficulty: "Fácil",
    question: "Qual é o nome da protagonista?",
    options: ["Sakura Kinomoto", "Tomoyo Daidouji", "Meiling Li", "Nakuru Akizuki"],
    answer: 0,
    explanation: "Sakura Kinomoto é a protagonista."
  },
  {
    anime: "Sakura Card Captors", difficulty: "Médio",
    question: "Qual criatura guardiã aparece como um pequeno leão alado?",
    options: ["Yue", "Kero", "Suppi", "Spinel Sun"],
    answer: 1,
    explanation: "Kero, ou Kerberos, é o guardião das cartas Clow."
  },

  // POKÉMON
  {
    anime: "Pokémon", difficulty: "Fácil",
    question: "Qual Pokémon é o companheiro mais famoso de Ash?",
    options: ["Charmander", "Pikachu", "Eevee", "Mewtwo"],
    answer: 1,
    explanation: "Pikachu é o parceiro mais conhecido de Ash."
  },
  {
    anime: "Pokémon", difficulty: "Fácil",
    question: "Qual tipo de Pokémon é Pikachu?",
    options: ["Fogo", "Água", "Elétrico", "Planta"],
    answer: 2,
    explanation: "Pikachu é do tipo Elétrico."
  },

  // CHAINSAW MAN
  {
    anime: "Chainsaw Man", difficulty: "Fácil",
    question: "Qual é o nome do protagonista?",
    options: ["Aki Hayakawa", "Denji", "Kishibe", "Yoshida"],
    answer: 1,
    explanation: "Denji é o protagonista de Chainsaw Man."
  },
  {
    anime: "Chainsaw Man", difficulty: "Médio",
    question: "Qual é o nome do demônio que se torna companheiro de Denji?",
    options: ["Power", "Pochita", "Beam", "Angel"],
    answer: 1,
    explanation: "Pochita é o Demônio da Motosserra."
  },

  // MY HERO ACADEMIA
  {
    anime: "My Hero Academia", difficulty: "Fácil",
    question: "Qual é o nome civil de Deku?",
    options: ["Katsuki Bakugo", "Shoto Todoroki", "Izuku Midoriya", "Tenya Iida"],
    answer: 2,
    explanation: "Deku é o apelido de Izuku Midoriya."
  },
  {
    anime: "My Hero Academia", difficulty: "Médio",
    question: "Quem transmite o One For All para Izuku?",
    options: ["Endeavor", "All Might", "Hawks", "Aizawa"],
    answer: 1,
    explanation: "All Might escolhe Izuku como sucessor."
  },

  // HUNTER X HUNTER
  {
    anime: "Hunter x Hunter", difficulty: "Fácil",
    question: "Quem é o protagonista de Hunter x Hunter?",
    options: ["Killua", "Kurapika", "Leorio", "Gon Freecss"],
    answer: 3,
    explanation: "Gon Freecss parte em busca de seu pai."
  },
  {
    anime: "Hunter x Hunter", difficulty: "Médio",
    question: "Qual é o sobrenome de Killua?",
    options: ["Freecss", "Zoldyck", "Kurta", "Nostrade"],
    answer: 1,
    explanation: "Killua nasceu na família Zoldyck."
  },

  // BLEACH
  {
    anime: "Bleach", difficulty: "Fácil",
    question: "Quem é o protagonista de Bleach?",
    options: ["Ichigo Kurosaki", "Uryu Ishida", "Renji Abarai", "Byakuya Kuchiki"],
    answer: 0,
    explanation: "Ichigo Kurosaki recebe poderes de Shinigami."
  },
  {
    anime: "Bleach", difficulty: "Médio",
    question: "Qual Shinigami transfere poderes a Ichigo no começo da história?",
    options: ["Rangiku", "Rukia Kuchiki", "Yoruichi", "Soi Fon"],
    answer: 1,
    explanation: "Rukia Kuchiki é fundamental para o despertar dos poderes de Ichigo."
  },

  // TOKYO GHOUL
  {
    anime: "Tokyo Ghoul", difficulty: "Fácil",
    question: "Qual é o nome do protagonista?",
    options: ["Ken Kaneki", "Hide Nagachika", "Juuzou Suzuya", "Koutarou Amon"],
    answer: 0,
    explanation: "Ken Kaneki passa por uma transformação que muda sua vida."
  },
  {
    anime: "Tokyo Ghoul", difficulty: "Médio",
    question: "Qual é o nome da cafeteria ligada a Kaneki?",
    options: ["Baratie", "Anteiku", "Urahara", "Doutor"],
    answer: 1,
    explanation: "Anteiku é a cafeteria central para vários personagens da história."
  },

  // KAGUYA-SAMA
  {
    anime: "Kaguya-sama: Love Is War", difficulty: "Fácil",
    question: "Qual é o nome do presidente do conselho estudantil?",
    options: ["Yu Ishigami", "Miyuki Shirogane", "Tsubasa Tanuma", "Maki Shijo"],
    answer: 1,
    explanation: "Miyuki Shirogane é o presidente do conselho."
  },
  {
    anime: "Kaguya-sama: Love Is War", difficulty: "Fácil",
    question: "Qual é o nome da protagonista feminina?",
    options: ["Chika Fujiwara", "Ai Hayasaka", "Kaguya Shinomiya", "Miko Iino"],
    answer: 2,
    explanation: "Kaguya Shinomiya é uma das protagonistas."
  },

  // YOUR NAME
  {
    anime: "Your Name", difficulty: "Fácil",
    question: "Quais são os dois protagonistas de Your Name?",
    options: ["Sakura e Syaoran", "Mitsuha e Taki", "Usagi e Mamoru", "Hina e Hodaka"],
    answer: 1,
    explanation: "Mitsuha Miyamizu e Taki Tachibana são os protagonistas."
  },
  {
    anime: "Your Name", difficulty: "Médio",
    question: "Que fenômeno incomum conecta a vida dos protagonistas?",
    options: ["Viagem no tempo por uma máquina", "Troca de corpos", "Uma competição de luta", "Um jogo virtual"],
    answer: 1,
    explanation: "Os protagonistas começam a trocar de corpos misteriosamente."
  },

  // STEINS;GATE
  {
    anime: "Steins;Gate", difficulty: "Fácil",
    question: "Qual é o apelido usado por Rintaro Okabe?",
    options: ["Hououin Kyouma", "El Psy Kongroo", "Mad Scientist Zero", "Kuro"],
    answer: 0,
    explanation: "Okabe gosta de se apresentar como Hououin Kyouma."
  },
  {
    anime: "Steins;Gate", difficulty: "Médio",
    question: "Qual tema é central em Steins;Gate?",
    options: ["Futebol profissional", "Viagem no tempo", "Caça a demônios", "Vôlei escolar"],
    answer: 1,
    explanation: "A história gira em torno de experimentos e mensagens através do tempo."
  }
];

const MODES = {
  5: { name: "Modo Aprendiz", count: 5 },
  10: { name: "Modo Otaku", count: 10 },
  30: { name: "Modo Lenda Otaku", count: 30 }
};

const selectedAnimes = new Set();
let visibleAnimeLimit = 12;
let quizQuestions = [];
let currentIndex = 0;
let correct = 0;
let wrong = 0;
let answered = false;
let selectedMode = 5;
let lastResultMode = 5;

const screens = {
  home: $("homeScreen"),
  quiz: $("quizScreen"),
  result: $("resultScreen")
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function buildCategoryFilter() {
  const categories = [...new Set(ANIMES.flatMap((anime) => anime.genres))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    $("categoryFilter").appendChild(option);
  }
}

function renderAnimeList() {
  const query = $("animeSearch").value.trim().toLocaleLowerCase("pt-BR");
  const category = $("categoryFilter").value;

  const filtered = ANIMES.filter((anime) => {
    const matchesSearch = anime.name.toLocaleLowerCase("pt-BR").includes(query);
    const matchesCategory = category === "all" || anime.genres.includes(category);
    return matchesSearch && matchesCategory;
  });

  const shown = filtered.slice(0, visibleAnimeLimit);
  const grid = $("animeGrid");
  grid.replaceChildren();

  if (shown.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-list";
    empty.textContent = "Nenhum anime encontrado. Tente outra pesquisa.";
    grid.appendChild(empty);
  }

  for (const anime of shown) {
    const label = document.createElement("label");
    label.className = "anime-option";
    if (selectedAnimes.has(anime.name)) label.classList.add("selected");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedAnimes.has(anime.name);
    checkbox.setAttribute("aria-label", `Selecionar ${anime.name}`);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedAnimes.add(anime.name);
      } else {
        selectedAnimes.delete(anime.name);
      }
      renderAnimeList();
      updateAvailability();
    });

    const details = document.createElement("span");
    const title = document.createElement("span");
    title.className = "anime-name";
    title.textContent = anime.name;

    const genres = document.createElement("span");
    genres.className = "anime-genre";
    genres.textContent = anime.genres.join(" · ");

    details.append(title, genres);
    label.append(checkbox, details);
    grid.appendChild(label);
  }

  const showAllButton = $("showAllButton");
  showAllButton.classList.toggle("hidden", filtered.length <= visibleAnimeLimit);
  showAllButton.textContent =
    visibleAnimeLimit >= filtered.length ? "Lista completa" : `Ver todos (${filtered.length})`;

  $("selectedCount").textContent = `${selectedAnimes.size} selecionados`;
}

function getSelectedQuestions() {
  return QUESTIONS.filter((question) => selectedAnimes.has(question.anime));
}

function updateAvailability() {
  const count = getSelectedQuestions().length;
  const modes = Object.values(MODES);

  if (selectedAnimes.size === 0) {
    $("questionAvailability").textContent = "Selecione pelo menos um anime.";
  } else {
    const possible = modes
      .filter((mode) => count >= mode.count)
      .map((mode) => mode.count);

    $("questionAvailability").textContent =
      `${count} perguntas disponíveis nos animes selecionados.` +
      (possible.length
        ? ` Modos disponíveis: ${possible.join(", ")} perguntas.`
        : " Escolha mais animes para liberar os modos maiores.");
  }

  document.querySelectorAll("[data-mode]").forEach((button) => {
    const mode = Number(button.dataset.mode);
    button.disabled = selectedAnimes.size === 0 || count < mode;
    button.title = count < mode
      ? `Você precisa de ${mode} perguntas disponíveis. Atualmente: ${count}.`
      : `Começar o modo com ${mode} perguntas`;
  });
}

function startQuiz(mode) {
  selectedMode = Number(mode);
  lastResultMode = selectedMode;

  const pool = shuffle(getSelectedQuestions());

  if (selectedAnimes.size === 0) {
    window.alert("Escolha pelo menos um anime antes de começar!");
    return;
  }

  if (pool.length < selectedMode) {
    window.alert(
      `Os animes selecionados têm apenas ${pool.length} perguntas disponíveis.\n\n` +
      `O modo escolhido precisa de ${selectedMode} perguntas.\n` +
      "Selecione mais animes para continuar."
    );
    return;
  }

  quizQuestions = pool.slice(0, selectedMode);
  currentIndex = 0;
  correct = 0;
  wrong = 0;
  answered = false;

  $("quizModeLabel").textContent = MODES[selectedMode].name.toUpperCase();
  $("quizAnimeLabel").textContent =
    selectedAnimes.size === 1
      ? [...selectedAnimes][0]
      : `${selectedAnimes.size} animes selecionados`;

  updateScore();
  showScreen("quiz");
  renderQuestion();
}

function updateScore() {
  $("correctCount").textContent = correct;
  $("wrongCount").textContent = wrong;
}

function renderQuestion() {
  answered = false;
  const question = quizQuestions[currentIndex];

  $("questionCounter").textContent =
    `${currentIndex + 1} / ${quizQuestions.length}`;
  $("progressBar").style.width =
    `${(currentIndex / quizQuestions.length) * 100}%`;

  $("animeBadge").textContent = question.anime.toUpperCase();
  $("difficultyBadge").textContent = question.difficulty.toUpperCase();
  $("questionText").textContent = question.question;

  $("feedback").className = "feedback hidden";
  $("feedback").textContent = "";
  $("nextButton").classList.add("hidden");
  $("nextButton").textContent =
    currentIndex === quizQuestions.length - 1
      ? "Ver resultado 🏆"
      : "Próxima pergunta →";

  const answers = $("answers");
  answers.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    button.append(letter, text);
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(index) {
  if (answered) return;
  answered = true;

  const question = quizQuestions[currentIndex];
  const buttons = [...$("answers").querySelectorAll("button")];
  const feedback = $("feedback");

  buttons.forEach((button) => {
    button.disabled = true;
  });

  buttons[question.answer].classList.add("correct");

  if (index === question.answer) {
    correct++;
    feedback.className = "feedback good";
    feedback.textContent = `✅ Acertou, otaku! ${question.explanation}`;
  } else {
    wrong++;
    buttons[index].classList.add("wrong");
    feedback.className = "feedback bad";
    feedback.textContent =
      `❌ Errou! A resposta certa era: ${question.options[question.answer]}. ` +
      question.explanation;
  }

  updateScore();
  $("progressBar").style.width =
    `${((currentIndex + 1) / quizQuestions.length) * 100}%`;
  $("nextButton").classList.remove("hidden");
}

function nextQuestion() {
  if (!answered) return;

  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  showScreen("result");

  const total = quizQuestions.length;
  const percent = Math.round((correct / total) * 100);
  const perfect = correct === total;

  $("scorePercent").textContent = `${percent}%`;
  $("resultCorrect").textContent = correct;
  $("resultWrong").textContent = wrong;
  $("resultMode").textContent = MODES[selectedMode].name;
  $("resultAnimeCount").textContent =
    new Set(quizQuestions.map((question) => question.anime)).size;

  $("resultIcon").textContent = perfect ? "👑" : percent >= 70 ? "🔥" : "😂";

  if (selectedMode === 5 && wrong >= 3) {
    $("resultTitle").textContent = "KKKKKK, NOOB! 😂";
    $("resultMessage").textContent =
      "Você errou 3 ou mais perguntas! Vai assistir ao anime de novo, mn ksksks!";
    $("rankMessage").textContent =
      "📺 Treine mais um pouco e volte para provar que conhece os animes.";
  } else if (selectedMode === 5 && perfect) {
    $("resultTitle").textContent = "Aquecimento perfeito! 🎯";
    $("resultMessage").textContent =
      "Cinco de cinco! Você começou com tudo. Agora tente o Modo Otaku.";
    $("rankMessage").textContent =
      "⚡ Próximo desafio: 10 perguntas!";
  } else if (selectedMode === 10 && perfect) {
    $("resultTitle").textContent = "VOCÊ É BRABO! 🔥";
    $("resultMessage").textContent =
      "Parabéns! Você acertou todas as 10 perguntas. Seu conhecimento de anime é impressionante!";
    $("rankMessage").textContent =
      "🏆 Você conquistou o título de Otaku de Elite. Agora encare as 30 perguntas!";
  } else if (selectedMode === 30 && perfect) {
    $("resultTitle").textContent = "OTAKU SUPREMO! 👑";
    $("resultMessage").textContent =
      "KSksks, você acertou as 30 perguntas! Parabéns por ser tão Otaku!";
    $("rankMessage").textContent =
      "👑 TÍTULO DESBLOQUEADO: LENDA OTAKU!";
  } else if (percent >= 70) {
    $("resultTitle").textContent = "Mandou bem, otaku! 🔥";
    $("resultMessage").textContent =
      `Você acertou ${correct} de ${total}. Tá sabendo bastante, mas dá para melhorar!`;
    $("rankMessage").textContent =
      "💜 Jogue mais uma rodada para buscar a pontuação perfeita.";
  } else if (percent >= 40) {
    $("resultTitle").textContent = "Dá para melhorar! 😅";
    $("resultMessage").textContent =
      `Você acertou ${correct} de ${total}. Mais alguns episódios e você fica fera!`;
    $("rankMessage").textContent =
      "📺 Reveja seus animes favoritos e tente de novo.";
  } else {
    $("resultTitle").textContent = "Ih, deu ruim! 😂";
    $("resultMessage").textContent =
      `Você acertou ${correct} de ${total}. Ainda tem muito anime para descobrir!`;
    $("rankMessage").textContent =
      "🍜 Treine seus conhecimentos e volte para o desafio.";
  }
}

$("animeSearch").addEventListener("input", () => {
  visibleAnimeLimit = ANIMES.length;
  renderAnimeList();
});

$("categoryFilter").addEventListener("change", () => {
  visibleAnimeLimit = ANIMES.length;
  renderAnimeList();
});

$("selectAllButton").addEventListener("click", () => {
  const query = $("animeSearch").value.trim().toLocaleLowerCase("pt-BR");
  const category = $("categoryFilter").value;

  const matching = ANIMES.filter((anime) => {
    const matchesSearch = anime.name.toLocaleLowerCase("pt-BR").includes(query);
    const matchesCategory = category === "all" || anime.genres.includes(category);
    return matchesSearch && matchesCategory;
  });

  matching.forEach((anime) => selectedAnimes.add(anime.name));
  renderAnimeList();
  updateAvailability();
});

$("clearButton").addEventListener("click", () => {
  selectedAnimes.clear();
  renderAnimeList();
  updateAvailability();
});

$("showAllButton").addEventListener("click", () => {
  visibleAnimeLimit = ANIMES.length;
  renderAnimeList();
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => startQuiz(button.dataset.mode));
});

$("nextButton").addEventListener("click", nextQuestion);

$("quitButton").addEventListener("click", () => {
  if (window.confirm("Sair do desafio? O progresso desta rodada será perdido.")) {
    showScreen("home");
  }
});

$("retryButton").addEventListener("click", () => {
  startQuiz(lastResultMode);
});

$("homeButton").addEventListener("click", () => {
  showScreen("home");
});

buildCategoryFilter();
renderAnimeList();
updateAvailability();

console.log("Desafio Otaku carregado!");
console.log(`${ANIMES.length} animes cadastrados.`);
console.log(`${QUESTIONS.length} perguntas cadastradas.`);
